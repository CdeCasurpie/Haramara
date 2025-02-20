import NavBar from "@/components/NavBar";

export default function clientLayout({ children }) {
    return (
        <>
        <NavBar />
        {children}
        </>
    );
}