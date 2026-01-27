import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            <div className="flex items-center justify-center flex-row gap-3">
              <div>Career</div> <div className="text-primary">Dock</div>
            </div>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your Professional Job Application Tracker
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-card border border-border p-6 rounded-lg hover:border-foreground/20 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-card-foreground">
              Track Applications
            </h3>
            <p className="text-muted-foreground">
              Keep all your job applications organized in one place
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg hover:border-foreground/20 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-card-foreground">
              Monitor Progress
            </h3>
            <p className="text-muted-foreground">
              Track interview rounds and application status
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg hover:border-foreground/20 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-card-foreground">
              Company Reviews
            </h3>
            <p className="text-muted-foreground">
              Read verified reviews to make informed decisions
            </p>
          </div>
        </div>
        <div className="text-center">
          {isAuthenticated() ? (
            <>
              <p className="text-lg text-foreground mb-8">
                Get started by viewing your dashboard or public reviews!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="hover: cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  className="hover: cursor-pointer"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Profile
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-foreground mb-8">
                Get started by logging in or signing up!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="hover: cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="hover: cursor-pointer"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Signup
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
