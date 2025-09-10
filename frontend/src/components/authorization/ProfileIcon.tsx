import { Link } from "@heroui/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@heroui/avatar";

const ProfileIcon = () => {
	const { user, isAuthenticated } = useAuth0();

	return (
		isAuthenticated && (
			<div className="flex flex-row items-center gap-2">
				<Link href={`profile/${user?.username}`} title="Profile">
					<Avatar
						isFocusable
						showFallback
						name={user?.name}
						src={user?.picture}
					/>
				</Link>

				<h2>{user?.username}</h2>
			</div>
		)
	);
};

export default ProfileIcon;
