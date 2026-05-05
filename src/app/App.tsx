function App() {
  return (
    <main className="page-shell">
      <div className="container-page py-10 sm:py-14">
        <div className="space-y-10">
          <header className="space-y-4">
            <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
              globals.css check
            </span>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                칸반 대시보드
              </h1>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <ThemePreview description=":root" title="라이트 모드" />
            <div className="dark">
              <ThemePreview description=".dark selector" title="다크 모드" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type ThemePreviewProps = {
  description: string;
  title: string;
};

function ThemePreview({ description, title }: ThemePreviewProps) {
  return (
    <section className="bg-background text-foreground rounded-4xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-muted-foreground max-w-xl text-sm leading-6">{description}</p>
        </div>
        <div className="bg-card text-card-foreground rounded-2xl border px-4 py-2 text-sm">
          card + card-foreground
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ColorSwatch
          className="bg-primary text-primary-foreground"
          label="Primary"
          token="bg-primary text-primary-foreground"
        />
        <ColorSwatch
          className="bg-secondary text-secondary-foreground border"
          label="Secondary"
          token="bg-secondary text-secondary-foreground"
        />
        <ColorSwatch
          className="bg-accent text-accent-foreground border"
          label="Accent"
          token="bg-accent text-accent-foreground"
        />
      </div>

      <div className="mt-6 grid gap-4">
        <div className="bg-card rounded-3xl border p-5" id="focus-preview">
          <p className="text-muted-foreground text-sm font-medium">포커스</p>
          <div className="mt-4 space-y-4">
            <input
              className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background w-full rounded-lg border px-3 py-2 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="클릭 및 탭으로 포커스 확인"
              type="text"
            />
            <div className="flex flex-wrap justify-end gap-3">
              <button className="bg-success text-success-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-md px-4 py-2 text-sm font-medium transition outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2">
                Success
              </button>
              <button className="bg-destructive text-destructive-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-lg px-4 py-2 text-sm font-medium transition outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2">
                Destructive
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ColorSwatchProps = {
  className: string;
  label: string;
  token: string;
};

function ColorSwatch({ className, label, token }: ColorSwatchProps) {
  return (
    <article className={`${className} rounded-2xl p-5 shadow-sm`}>
      <p className="text-sm text-current/75">{label}</p>
      <p className="mt-2 text-lg font-semibold">{token}</p>
    </article>
  );
}

export default App;
