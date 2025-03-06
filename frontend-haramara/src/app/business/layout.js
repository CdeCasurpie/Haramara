import BusinessSideBar from "@/components/BusinessSideBar";
import NavBarBusiness from "@/components/NavBarBusiness";
import { Bus } from "lucide-react";

export default function clientLayout({ children }) {
    return (
        <>
        <NavBarBusiness />
        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, height:'80vh' }}>
            <div style={{ position: 'relative', width: '15%', background: 'white', minWidth: '250px'}}>
                <BusinessSideBar />
            </div>
            <div style={{ flex: 1, height:'100%', background: 'white', padding: '40px', paddingTop: '40px', paddingLeft: '60px', width: '100%', overflow: 'hidden', paddingRight: '80px' }}>
                {children}
            </div>
        </div>
        </>
    );
}