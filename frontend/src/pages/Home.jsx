
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  ArrowRight,
  Sparkles,
  Code2,
  Lightbulb,
  PenLine,
} from "lucide-react";
import api from "../api.js";

const suggestions = [
  {
    icon: Code2,
    title: "Write code",
    prompt: "Help me write code",
  },
  {
    icon: Lightbulb,
    title: "Explore ideas",
    prompt: "Let's brainstorm some ideas",
  },
  {
    icon: PenLine,
    title: "Create content",
    prompt: "Help me write something",
  },
];

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState("loading");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await api.get("/user/profile");

        setUser(response.data.user);
        setUserStatus("logged-in");
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          setUserStatus("logged-out");
        } else {
          setUserStatus("error");
        }
      }
    }

    checkSession();
  }, []);

  const isLoggedIn = userStatus === "logged-in";
  const firstName = user?.name?.split(" ")[0] || "there";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!prompt.trim()) return;

    navigate("/chat", {
      state: { prompt: prompt.trim() },
    });
  };

  if (userStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f6fc]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#ded4ed] border-t-[#29252e]" />
      </div>
    );
  }

  if (userStatus === "error") {
    return (
     <div className="min-h-screen w-full">
        <p className="text-sm text-[#77717d]">
          Could not check your session.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-[#29252e] px-5 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full overflow-x-hidden">
      <main
       className="flex min-h-dvh w-full flex-col"
       style={{
        background:
           "linear-gradient(155deg, #fffafb 0%, #faf5ff 48%, #e8dfff 100%)",
        }}
      >
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29252e] text-white">
              <Sparkles size={18} strokeWidth={1.8} />
            </div>

            <span className="text-[15px] font-semibold tracking-tight text-[#29252e]">
              ChatApp
            </span>
          </div>

          {isLoggedIn ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e9e0f5] text-sm font-semibold text-[#29252e] shadow-sm transition hover:scale-105"
              title="Your profile"
            >
              {firstName.charAt(0).toUpperCase()}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-[#29252e] transition hover:opacity-60"
              >
                Log in
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="rounded-full bg-[#29252e] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#45404b]"
              >
                Sign up
              </button>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center px-5 pb-12 text-center">
          <div className="max-w-[600px]">
            <p className="text-[20px] font-normal tracking-tight text-[#45404b] md:text-[24px]">
              {isLoggedIn
                ? `Hi, ${firstName} 👋`
                : "Welcome to ChatApp"}
            </p>

            <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.04em] text-[#242128] md:text-[40px]">
              What can I help you with?
            </h1>

            <p className="mx-auto mt-4 max-w-[380px] text-[13px] leading-6 text-[#807987]">
              {isLoggedIn
                ? "Ask anything, explore ideas, or create something amazing."
                : "Your space to think, create, and explore with AI."}
            </p>
          </div>

          {/* Suggestion cards */}
          {isLoggedIn ? (
            <div className="mt-20 grid w-full max-w-[490px] grid-cols-1 gap-3 sm:grid-cols-3">
              {suggestions.map(({ icon: Icon, title, prompt: value }) => (
                <button
                  key={title}
                  onClick={() => setPrompt(value)}
                  className="group flex min-h-[105px] flex-col items-start justify-between rounded-[14px] border border-[#e3dce9] bg-white/55 p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-white/85 hover:shadow-md"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                    className="text-[#514958]"
                  />

                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-[#39333e]">
                      {title}
                    </span>
                    <ArrowRight
                      size={13}
                      className="text-[#8e8498] opacity-0 transition group-hover:opacity-100"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 rounded-full bg-[#29252e] px-7 py-3 text-xs font-medium text-white transition hover:bg-[#45404b]"
              >
                Get started
                <ArrowRight size={15} />
              </button>

              <p className="text-xs text-[#89818e]">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold text-[#39313f] hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          )}

          {/* Chat Input */}
          <form
            onSubmit={handleSubmit}
            className={`flex w-full max-w-[490px] items-center gap-3 rounded-full border-[3px] border-white bg-white/80 px-4 py-2.5 shadow-[0_5px_25px_rgba(80,60,110,0.05)] ${
              isLoggedIn ? "mt-9" : "mt-14"
            }`}
          >
            <Sparkles size={17} className="shrink-0 text-[#9b90aa]" />

            <input
              type="text"
              value={prompt}
              readOnly={!isLoggedIn}
              onClick={() => {
                if (!isLoggedIn) navigate("/login");
              }}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                isLoggedIn
                  ? "Ask anything..."
                  : "Log in to start a conversation..."
              }
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#29252e] outline-none placeholder:text-[#aaa2b0]"
            />

            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#29252e] text-white transition hover:bg-[#51465b]"
              aria-label="Send message"
            >
              <ArrowUp size={17} />
            </button>
          </form>

          <p className="mt-4 text-[10px] text-[#a29aaa]">
            Powered by AI · Made for curiosity
          </p>
        </section>
      </main>
    </div>
  );
}

export default Home;
