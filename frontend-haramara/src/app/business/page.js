'use client';

import NavBar from "@/components/NavBar";
import styles from './page.module.css';
import SearchBar from "@/components/home/SearchBar";
import ActivityCard from "@/components/home/ActivityCard";
import BannerCard from "@/components/home/BannerCard";
import Footer from "@/components/Footer";
import BusinessDashboard from "./dashboard/page";

export default function Home() {
  return (
    <>
      <BusinessDashboard />
    </>
  );
}