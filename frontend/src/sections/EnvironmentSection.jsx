import EnvironmentStatus from "../components/EnvironmentStatus";

export default function EnvironmentSection({ analysis }) {

    return (

        <>

            <h2 className="section-title">

                Environmental Health

            </h2>

            <EnvironmentStatus
                analysis={analysis}
            />

        </>

    );

}