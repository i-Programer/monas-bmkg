// resources/js/pages/Home.jsx
import { PageLayout } from "@/Layouts";
import React from "react";
import { MapIndonesia, TabComponent } from "@/Components";

const Home = () => {
    return (
        <>
            <PageLayout>
                <div className="max-w-[100%] overflow-x-hidden overflow-y-auto flex justify-center items-center">
                    <div className="flex flex-row justify-center items-start w-full">
                        <MapIndonesia />
                        {/* <TabComponent /> */}
                    </div>
                </div>
            </PageLayout>
        </>
    );
};

export default Home;
