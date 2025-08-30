interface IAppHeaderProps {
  title?: string;
}

export default function AppHeader({ title = "Notes" }: IAppHeaderProps) {
  return (
    <header className="notes-header py-4 px-8">
      <h1 className="text-white text-2xl font-bold">{title}</h1>
    </header>
  );
}
