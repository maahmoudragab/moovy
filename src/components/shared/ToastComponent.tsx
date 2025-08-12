import { Toaster } from "sonner";

export default function ToastComponent() {
  return (
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          marginTop: "58px",
        }
      }}
    />
  );
}