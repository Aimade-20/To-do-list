
import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  Edit,
  Delete,
  TaskAlt,
  Assignment,
  PendingActions,
  CheckCircle,
  Close,
} from "@mui/icons-material";

import {
  getTasks,
  getTasksById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const statusLabels = {
  Todo: "To do",
  doin: "In progress",
  done: "Done",
};

const emptyForm = {
  title: "",
  description: "",
  status: "Todo",
};

// Support different response shapes from the Backend
const extractTask = (data) => {
  return data?.task ?? data?.data ?? data;
};

const extractTasks = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tasks)) return data.tasks;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [openForm, setOpenForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsTask, setDetailsTask] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo",
  });

  // Get all tasks
  async function fetchTasks() {
    try {
      setError("");

      const data = await getTasks();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  // Load tasks when page opens
  useEffect(() => {
    fetchTasks();
  }, []);

  // Search and filter
  const filteredTasks = tasks.filter((task) => {
    const title = (task.title || "").toLowerCase();
    const description = (task.description || "").toLowerCase();
    const text = search.toLowerCase();

    const matchesSearch =
      title.includes(text) || description.includes(text);

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const doingTasks = tasks.filter(
    (task) => task.status === "doin"
  ).length;

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  function getStatusColor(status) {
    if (status === "done") return "success";
    if (status === "doin") return "warning";
    return "default";
  }

  // Open create form
  function handleOpenCreate() {
    setSelectedTask(null);

    setForm({
      title: "",
      description: "",
      status: "Todo",
    });

    setError("");
    setSuccess("");
    setOpenForm(true);
  }

  // Open edit form
  function handleOpenEdit(task) {
    setSelectedTask(task);

    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });

    setError("");
    setSuccess("");
    setOpenForm(true);
  }

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // Create or update task
  async function handleSubmit() {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (selectedTask) {
        await updateTask(selectedTask._id, form);
        setSuccess("Task updated successfully");
      } else {
        await createTask(form);
        setSuccess("Task created successfully");
      }

      setOpenForm(false);
      setSelectedTask(null);

      setForm({
        title: "",
        description: "",
        status: "Todo",
      });

      await fetchTasks();
    } catch (error) {
      setError("Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  // Change task status
  async function handleStatusChange(task, newStatus) {
    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        status: newStatus,
      });

      await fetchTasks();
    } catch (error) {
      setError("Failed to change task status");
    }
  }

  // Delete task
  async function handleDelete(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);

      if (detailsTask && detailsTask._id === taskId) {
        setDetailsTask(null);
      }

      setSuccess("Task deleted successfully");
      await fetchTasks();
    } catch (error) {
      setError("Failed to delete task");
    }
  }

  // Show task details
  async function handleOpenDetails(task) {
    setDetailsTask(task);
    setDetailsLoading(true);

    try {
      const data = await getTasksById(task._id);

      setDetailsTask(data.task || data);
    } catch (error) {
      setError("Failed to load task details");
    } finally {
      setDetailsLoading(false);
    }
  }

  // Close form
  function handleCloseForm() {
    if (saving) return;

    setOpenForm(false);
    setSelectedTask(null);
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F9FC",
        pb: 5,
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          color: "#173F35",
          borderBottom: "1px solid #E7EBF0",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            boxSizing: "border-box",
            px: { xs: 2, md: 4 },
            minHeight: "76px !important",
          }}
        >
          <TaskAlt sx={{ fontSize: 32, mr: 1.5 }} />

          <Typography
            variant="h5"
            sx={{ fontWeight: 800, flexGrow: 1 }}
          >
            TaskFlow
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: "#173F35",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              "&:hover": { bgcolor: "#0E2F27" },
            }}
          >
            Create Task
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 5 }}>
        {/* Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#173F35",
              mb: 1,
            }}
          >
            My Tasks
          </Typography>

          <Typography color="text.secondary">
            Manage your tasks and track your progress.
          </Typography>
        </Box>

        {/* Messages */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Statistics */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tasks"
              count={totalTasks}
              icon={<Assignment />}
              color="#173F35"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="To do"
              count={todoTasks}
              icon={<PendingActions />}
              color="#64748B"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              count={doingTasks}
              icon={<TaskAlt />}
              color="#D97706"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              count={doneTasks}
              icon={<CheckCircle />}
              color="#16A34A"
            />
          </Grid>
        </Grid>

        {/* Search + filter */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            border: "1px solid #E7EBF0",
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
          >
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <Search
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />

            <TextField
              select
              label="Filter by status"
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.target.value)
              }
              sx={{
                minWidth: { xs: "100%", md: 200 },
              }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="Todo">To do</MenuItem>
              <MenuItem value="doin">In progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Tasks table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #E7EBF0",
            borderRadius: 3,
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 700 }}>
                  Task
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Description
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Status
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Created At
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 5 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 2 }}>
                        Loading tasks...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 5 }}>
                      <Typography
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        No tasks found.
                      </Typography>

                      <Button
                        onClick={() => {
                          setSearch("");
                          setFilterStatus("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task._id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#173F35",
                        }}
                      >
                        {task.title}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography
                        color="text.secondary"
                        noWrap
                      >
                        {task.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={task.status || "Todo"}
                        onChange={(event) =>
                          handleStatusChange(
                            task,
                            event.target.value
                          )
                        }
                        sx={{
                          minWidth: 130,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        <MenuItem value="Todo">
                          To do
                        </MenuItem>

                        <MenuItem value="doin">
                          In progress
                        </MenuItem>

                        <MenuItem value="done">
                          Done
                        </MenuItem>
                      </TextField>
                    </TableCell>

                    <TableCell>
                      {task.createdAt
                        ? new Date(
                            task.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                      >
                        <IconButton
                          aria-label="View task"
                          color="primary"
                          onClick={() =>
                            handleOpenDetails(task)
                          }
                        >
                          <Visibility />
                        </IconButton>

                        <IconButton
                          aria-label="Edit task"
                          onClick={() =>
                            handleOpenEdit(task)
                          }
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          aria-label="Delete task"
                          color="error"
                          onClick={() =>
                            handleDelete(task._id)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Showing {filteredTasks.length} of {totalTasks} tasks
        </Typography>

        {/* Create / Edit dialog */}
        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 800,
            }}
          >
            {selectedTask
              ? "Edit Task"
              : "Create New Task"}

            <IconButton
              onClick={handleCloseForm}
              disabled={saving}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                required
                fullWidth
                label="Task title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                multiline
                minRows={4}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="Todo">To do</MenuItem>
                <MenuItem value="doin">
                  In progress
                </MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseForm}
              disabled={saving}
              sx={{
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                saving ||
                !form.title.trim() ||
                !form.description.trim()
              }
              sx={{
                bgcolor: "#173F35",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#0E2F27",
                },
              }}
            >
              {saving ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : selectedTask ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Task details dialog */}
        <Dialog
          open={Boolean(detailsTask)}
          onClose={() => setDetailsTask(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 800,
            }}
          >
            Task Details

            <IconButton
              onClick={() => setDetailsTask(null)}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {detailsLoading ? (
              <Box
                sx={{
                  py: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : detailsTask ? (
              <Stack spacing={2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#173F35",
                  }}
                >
                  {detailsTask.title}
                </Typography>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Description
                  </Typography>

                  <Typography>
                    {detailsTask.description}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Status
                  </Typography>

                  <Chip
                    label={
                      statusLabels[detailsTask.status] ||
                      detailsTask.status
                    }
                    color={getStatusColor(
                      detailsTask.status
                    )}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Created At
                  </Typography>

                  <Typography>
                    {detailsTask.createdAt
                      ? new Date(
                          detailsTask.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography>
                Task details are unavailable.
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setDetailsTask(null)}
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

// Reusable statistics card
function StatCard({ title, count, icon, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #E7EBF0",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#173F35",
              }}
            >
              {count}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: `${color}15`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Home;
