import { SpinnerCustom } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";

export default function Reviews() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  return <></>;
}
