function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      {children}
    </main>
  );
}
export default AuthLayout;
