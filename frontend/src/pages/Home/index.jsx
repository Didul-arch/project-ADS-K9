import TopCard from "./section/TopCard";
import Statistics from "./section/Statistics";
import RecentReport from "./section/RecentReport";

const Home = () => {
  return (
    <div className="p-8">
      <Statistics />
      <div className="my-8">
        <TopCard />
      </div>
      <RecentReport />
      
    </div>
  );
};

export default Home;
