const SUCCESS = "Success";

const ERROR_MESSAGES = {
  USER: {
    DUPLICATE: "Already a user exists with the provided email.",
    FETCH_BY_EMAIL: "Failed to fetch user data by email from database.",
    CREATE: "Failed to create the user in the database.",
    UPDATE: "Failed to update the user in the database.",
    INVALID_CREDENTIALS: "invalid username or password.",
  },
  SUBTASKS: {
    FETCH: "Failed to fetch all subtasks.",
    UPDATE: "Failed to update subtasks.",
  },
  TASKS: {
    NOT_FOUND: (id: string) => {
      return `No task found with task id ${id}.`;
    },
    FETCH_ALL: "Failed to fetch tasks.",
    FETCH_ONE: (id: string) => {
      return `Failed to fetch the task with task id ${id}.`
    },
    NO_TASKS: `No tasks are present associated with your user.`
  },
  INTERNAL_SERVER: "Internal Server Error. Kindly try again after some time.",
  INVALID_REQUEST_BODY: "Invalid request body.",
  UNAUTHORIZED: "Unauthorized.",
  INVALID_TOKEN: "Invalid token provided.",
};

export { SUCCESS, ERROR_MESSAGES };
