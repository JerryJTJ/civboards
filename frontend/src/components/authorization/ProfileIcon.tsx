import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@heroui/avatar";

const Profile = () => {
	const { user, isAuthenticated } = useAuth0();

	return (
		isAuthenticated && (
			<div className="flex flex-row items-center gap-2">
				<Avatar showFallback name={user?.name} src={user?.picture} />
				<h2>{user?.username}</h2>
			</div>
		)
	);
};

export default Profile;
