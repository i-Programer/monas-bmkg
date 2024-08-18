// resources/js/pages/Home.jsx
import { PageLayout } from "@/Layouts";
import React from "react";
import { Map, MapIndonesia, TabComponent } from "@/Components";

const Home = ({ openweather_api, stadiamaps_api}) => {
    return (
        <>
            <PageLayout>
                <div className="max-w-[100%] overflow-x-hidden overflow-y-auto flex justify-center items-center">
                    <div className="flex flex-row justify-center items-start w-full">
                        <Map stadiamaps_api={stadiamaps_api} openweather_api={openweather_api}/>
                        {/* <TabComponent /> */}
                    </div>
                </div>
            </PageLayout>
        </>
    );
};

export default Home;
