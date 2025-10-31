import { Link } from "@heroui/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";

import getViewportSize from "../utils/getViewportSize";

import useWindowDimensions from "@/hooks/useWindowDimensions";

const ProfileIcon = () => {
	const { user, isAuthenticated } = useAuth0();
	const { width } = useWindowDimensions();

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
					size={getViewportSize(width) === "xs" ? "sm" : "md"}
					src={user?.profile_pic}
				/>
				<h2>{user?.username}</h2>
			</Link>
		</Skeleton>
	);
};

export default ProfileIcon;
