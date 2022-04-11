import { Bubble } from "./components/bubble/bubble";
import { Header } from "./components/header/header";

function App() {
    const currentUser = 1;
    const messages = [
        { user: 1, text: "Hi user 2" },
        { user: 2, text: "Howdy" },
        { user: 2, text: "How are you doing?" },
        { user: 1, text: "I am fine thanks." },
        { user: 2, text: "Let's do something today" }
    ];

    return (
        <div className="App">
            <Header />
            <main>
                {messages.map((message, index) => (
                    <Bubble message={message} currentUser={currentUser} key={index} />
                ))}
            </main>
        </div>
    );
}

export default App;
