import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import LeaderboardPage from "@/pages/LeaderboardPage";
import GamesPage from "@/pages/GamesPage";

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<LeaderboardPage />} path="/leaderboard" />
			<Route element={<GamesPage />} path="/games" />
		</Routes>
	);
}

export default App;
