import { FC } from "react";
import { IDKitWidget } from '@worldcoin/idkit'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
}

const Login: FC<LoginProps> = ({setIsLoggedIn}) => {
    const onSuccess = (response: any) => {
        console.log(response);
        setIsLoggedIn(true);
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
                        app_id="app_staging_0d5bcb41d0871375ee57203a49a5d452" // obtained from the Developer Portal
                        action="test-action" // this is your action name from the Developer Portal
                        signal="user_value" // any arbitrary value the user is committing to, e.g. a vote
                        onSuccess={onSuccess} // minimum verification level accepted, defaults to "orb"
                    >
                        {({open}) =>
                            <Button 
                                onClick={() => open()}
                                className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white"
                                size="lg"
                            >
                                <Globe className="mr-2 h-4 w-4" /> Login with WorldID to continue
                            </Button>
                        }
                    </IDKitWidget>
                </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Login;