
import * as React from "react"

import { Toast } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

// Fix: Use 'typeof Toast' instead of just 'Toast'
type ToasterToastProps = React.ComponentPropsWithoutRef<typeof Toast> & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  onDismiss?: () => void;
}

// Renamed to avoid circular reference
type ToasterToast = ToasterToastProps;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
      onDismiss?: () => void; // Add onDismiss to DISMISS_TOAST action
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, onDismiss?: () => void) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })

    // Call onDismiss callback when toast is removed
    if (onDismiss) {
      onDismiss();
    }
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId, onDismiss } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action
      if (toastId) {
        addToRemoveQueue(toastId, onDismiss);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, toast.onDismiss || onDismiss);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Renamed to fix circular reference
type ToastProps = Omit<ToasterToast, "id">

// Deprecated: This function is now disabled to prevent toast notifications
// All notifications should use the Modal Universal system
function toast({ ...props }: ToastProps) {
  console.log("Toast notification blocked - using Modal Universal instead:", props.title, props.description);
  
  // Return dummy functions to maintain compatibility
  return {
    id: "disabled",
    dismiss: () => {},
    update: () => {},
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Return disabled toast functions
  return {
    ...state,
    toast: ({ ...props }: ToastProps) => {
      console.log("Toast notification blocked - using Modal Universal instead:", props.title, props.description);
      return {
        id: "disabled",
        dismiss: () => {},
        update: () => {},
      }
    },
    dismiss: (toastId?: string) => {
      console.log("Toast dismiss blocked - using Modal Universal instead");
    },
  }
}

export { useToast, toast }
