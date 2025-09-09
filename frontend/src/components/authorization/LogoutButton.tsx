import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@heroui/button";

const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<Button
			onPress={async () =>
				await logout({
					logoutParams: { returnTo: window.location.origin },
				})
			}
		>
			Log Out
		</Button>
	);
};

export default LogoutButton;
