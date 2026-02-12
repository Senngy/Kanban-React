import List from "./List";
import { useAuth } from "../lib/hooks/useAuth";

export default function Board() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold pb-2">Welcome, {user?.username}</h2>
      <List auth={{ user }} />
    </div>
  );
}
