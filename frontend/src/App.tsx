import { Route, Routes } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";

import GamesPage from "@pages/GamesPage";
import IndexPage from "@pages/index";
import LeaderboardPage from "@pages/LeaderboardPage";

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<LeaderboardPage />} path="/leaderboard" />
			<Route element={<GamesPage />} path="/games" />
			<Route element={<ProfilePage />} path="/profile/:username" />
			<Route element={<NotFoundPage />} path="*" />
		</Routes>
	);
}

export default App;
