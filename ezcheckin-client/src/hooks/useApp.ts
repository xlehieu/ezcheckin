import { toast, type ExternalToast } from "sonner";

type ApiError = {
  message?: string;
  statusCode?: number;
  field?: string;
};

class AppError extends Error {
  statusCode?: number;
  field?: string;

  constructor(error: ApiError) {
    super(error.message);

    this.statusCode = error.statusCode;
    this.field = error.field;
  }
}

const defaultOptions: ExternalToast = {
  duration: 3000,
};

export const useApp = () => {
  const getErrorMessage = (error: unknown): string => {
    // string
    if (typeof error === "string") {
      return error;
    }

    // native Error
    if (error instanceof Error) {
      return error.message;
    }

    // custom object
    if (typeof error === "object" && error !== null) {
      if ("message" in error) {
        return String(error.message);
      }
    }

    return "Something went wrong";
  };

  const notify = {
    // =========================
    // BASIC
    // =========================

    success: (
      message: string,
      options?: ExternalToast
    ) => {
      return toast.success(message, {
        ...defaultOptions,
        ...options,
      });
    },

    error: (
      error: unknown,
      options?: ExternalToast
    ) => {
      return toast.error(getErrorMessage(error), {
        ...defaultOptions,
        ...options,
      });
    },

    info: (
      message: string,
      options?: ExternalToast
    ) => {
      return toast.info(message, {
        ...defaultOptions,
        ...options,
      });
    },

    warning: (
      message: string,
      options?: ExternalToast
    ) => {
      return toast.warning(message, {
        ...defaultOptions,
        ...options,
      });
    },

    loading: (
      message: string,
      options?: ExternalToast
    ) => {
      return toast.loading(message, {
        ...defaultOptions,
        ...options,
      });
    },

    promise: async <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: ExternalToast
    ) => {
      return toast.promise(promise, {
        loading: messages.loading,

        success: () => {
          return messages.success;
        },

        error: (err) => {
          console.error(err);

          return getErrorMessage(err) || messages.error;
        },

        ...options,
      });
    },

    custom: (
      jsx: React.ReactElement,
      options?: ExternalToast
    ) => {
      return toast.custom(() => jsx, {
        ...defaultOptions,
        ...options,
      });
    },

    dismiss: (toastId?: string | number) => {
      return toast.dismiss(toastId);
    },

    // =========================
    // CRUD HELPERS
    // =========================

    created: (entity = "Data") => {
      return toast.success(
        `${entity} created successfully`
      );
    },

    updated: (entity = "Data") => {
      return toast.success(
        `${entity} updated successfully`
      );
    },

    deleted: (entity = "Data") => {
      return toast.success(
        `${entity} deleted successfully`
      );
    },

    // =========================
    // API ERROR
    // =========================

    apiError: async (
      response: Response,
      fallbackMessage = "Something went wrong"
    ) => {
      try {
        const data = await response.json();

        return toast.error(
          data?.message || fallbackMessage
        );
      } catch {
        return toast.error(fallbackMessage);
      }
    },

    // =========================
    // THROWABLE ERROR
    // =========================

    throwError: (
      message: string,
      statusCode?: number
    ) => {
      throw new AppError({
        message,
        statusCode,
      });
    },
  };

  return {
    notify,
  };
};