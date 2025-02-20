import BusinessSideBar from "@/components/BusinessSideBar";
import NavBarBusiness from "@/components/NavBarBusiness";
import { Bus } from "lucide-react";

export default function clientLayout({ children }) {
    return (
        <>
        <NavBarBusiness />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ position: 'relative', width: '15%', background: 'white' }}>
                <BusinessSideBar />
            </div>
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
        </>
    );
}