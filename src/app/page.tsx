export default function HomePage() {
  return (
    <main style={{ width: "100vw", height: "100dvh", overflow: "hidden", background: "#071426" }}>
      <iframe
        src="/game/index.html"
        title="Skool Game"
        allow="fullscreen; autoplay"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </main>
  );
}
