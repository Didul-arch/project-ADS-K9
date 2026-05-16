import TopCard from "./section/TopCard";
import Statistics from "./section/Statistics";
import RecentReport from "./section/RecentReport";
import QuickFilter from "./section/QuickFilter";

const Home = () => {
  return (
    <div className="flex gap-8">
      <div className="p-8">
        <Statistics />
        <div className="my-8">
          <TopCard />
        </div>
        <RecentReport />
      </div>

      <div className="p-8">
        <QuickFilter />
      </div>
    </div>
  );
};

export default Home;
