import { Route, Routes } from "react-router-dom";

import ProfilePage from "./pages/ProfilePage";

import IndexPage from "@/pages/index";
import LeaderboardPage from "@/pages/LeaderboardPage";
import GamesPage from "@/pages/GamesPage";

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<LeaderboardPage />} path="/leaderboard" />
			<Route element={<GamesPage />} path="/games" />
			<Route element={<ProfilePage />} path="/profile/:username" />
		</Routes>
	);
}

export default App;
