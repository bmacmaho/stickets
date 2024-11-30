import { FC } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { VerificationLevel } from "@worldcoin/idkit";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: FC<LoginProps> = ({ setIsLoggedIn }) => {
  const onSuccess = (response: any) => {
    console.log(response);
    setIsLoggedIn(true);
  };
  const verifyProof = async (proof) => {
    // throw new Error("TODO: verify proof server route");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <Card className="w-full max-w-md bg-white/90">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">STicket</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <IDKitWidget
              app_id="app_8755fcecdca34404a7c6afff893040c1" // obtained from the Developer Portal
              action="verify-humans" // this is your action name from the Developer Portal
              signal="user_value" // any arbitrary value the user is committing to, e.g. a vote
              onSuccess={onSuccess} // minimum verification level accepted, defaults to "orb"
              verification_level={VerificationLevel.Orb}
              handleVerify={verifyProof}
            >
              {({ open }) => (
                <Button
                  onClick={() => open()}
                  className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  <Globe className="mr-2 h-4 w-4" /> Login with WorldID to
                  continue
                </Button>
              )}
            </IDKitWidget>
          </CardContent>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => setIsLoggedIn(true)}
              className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <Globe className="mr-2 h-4 w-4" /> Continue as guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
