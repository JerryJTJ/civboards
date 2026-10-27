import { Button } from "@heroui/react";
import { useAuth0 } from "@auth0/auth0-react";

import getViewportSize from "@components/utils/getViewportSize";

import useWindowDimensions from "@hooks/useWindowDimensions";

const LogoutButton = () => {
	const { logout } = useAuth0();
	const { width } = useWindowDimensions();

	return (
		<Button
			className="border-fg"
			variant="primary"
			size={getViewportSize(width) === "xs" ? "sm" : "md"}
			onPress={() => {
				void logout({
					logoutParams: { returnTo: window.location.origin },
				});
			}}
		>
			Log Out
		</Button>
	);
};

export default LogoutButton;
