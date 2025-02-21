"use client";
import NavBar from "@/components/NavBar";
import React, { useState } from "react";

export default function ClientLayout({ children }) {

    return (
        <>
            <NavBar />
            {children}
        </>
    );
}