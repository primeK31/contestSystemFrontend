import Carousel from "./components/Carousel";
import { useMediaQuery } from 'react-responsive';


function Home() {

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const itemsToShow = isMobile ? 1 : 3;

  const items = [
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full w-full text-center" data-v0-t="card">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mr-4">
                  </span>
                  <div>
                    <h3 className="font-semibold">Zhanibek Beisenov</h3>
                    <p className="text-muted-foreground text-sm">KBTU 3rd year student and Junior tutor</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground">"This app change my teaching and studying experience and it makes world better!"</p>
              </div>
            </div>,
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full w-full text-center" data-v0-t="card">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mr-4">
                  </span>
                  <div>
                    <h3 className="font-semibold">Zhassulan Kainazarov</h3>
                    <p className="text-muted-foreground text-sm">3rd year KBTU student</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground">"It&#39;s very conveniet web application!"</p>
              </div>
            </div>,
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full w-full text-center" data-v0-t="card">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mr-4">
                  </span>
                  <div>
                    <h3 className="font-semibold">Tair Ospanov</h3>
                    <p className="text-muted-foreground text-sm">Junior Data Scientist</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground">"This app can help me to save my time! I&#39;'m not enjoying creating google forms"</p>
              </div>
            </div>
  ];
    return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        <section className="bg-blue-500 text-white py-8 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary-foreground">
                  Solve Engaging quizzes
                </h1>
                <p className="max-w-[600px] text-primary-foreground/80 text-sm md:text-base lg:text-xl">
                  Our forms generator and contest makes it simple to create, customize, and share interactive quizzes to test your
                  knowledge.
                </p>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full sm:w-auto">
                  <a href="/register">Get Started</a>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-background py-8 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                  How to start?
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div class="space-y-2">
          <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-8 w-8 text-primary"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" x2="12" y1="2" y2="15"></line>
              </svg>
              <h3 className="text-xl font-bold text-foreground">Register</h3>
              <p className="text-muted-foreground">
              Create your account
              </p>
            </div>
            <div className="space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path>
              </svg>
              <h3 className="text-xl font-bold text-foreground">Go to the rooms</h3>
              <p className="text-muted-foreground">Select room and start solving! (You can also create contests and rooms in <a href='/admin' className="underline text-blue-500">admin panel page</a>)
              Login: admin. Password: admin123 (login can take some seconds). If you do AI generated contest, you need to refresh page and login again to admin panel.</p>
            </div>
            <div className="space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <h3 className="text-xl font-bold text-foreground">Enjoy!</h3>
              <p className="text-muted-foreground">
                You can have competition and chat with your friends learn new things and get analytics of your submissions in your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*
    <section className="bg-muted py-8 md:py-16 lg:py-24 flex items-center justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
        <div className="space-y-8 text-center w-full">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-foreground">
              What Our Users Say
            </h2>
          </div>
          <div className="w-full">
            <Carousel items={items} itemsToShow={itemsToShow} />
          </div>
        </div>
      </div>
    </section>
    */}

    <section className="bg-background py-8 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">Ready to Solve Your First Quiz?</h2>
                <p className="max-w-[600px] text-muted-foreground text-sm md:text-base lg:text-xl">
                  Our quiz generator makes it easy to create engaging quizzes. Get started today and start testing your knowledge or that of your audience.
                </p>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto">
                  <a href="/register">Get Started</a>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    );
}

export default Home;