import { Link } from "@heroui/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";

const ProfileIcon = () => {
	const { user, isAuthenticated } = useAuth0();

	return (
		<Skeleton isLoaded={isAuthenticated}>
			<Link
				className="flex flex-row items-center gap-3 rounded-xl"
				href={`profile/${user?.username}`}
				title="Profile"
			>
				<Avatar
					isBordered
					isFocusable
					showFallback
					name={user?.name}
					src={user?.picture}
				/>
				<h2>{user?.username}</h2>
			</Link>
		</Skeleton>
	);
};

export default ProfileIcon;
