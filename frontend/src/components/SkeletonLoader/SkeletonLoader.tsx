import './SkeletonLoader.scss';
import Placeholder from 'react-bootstrap/Placeholder';

interface SkeletonComponentProps {
  className: string;
}

const SkeletonComponent = ({ className }: SkeletonComponentProps) => (
  <Placeholder animation="glow">
    <Placeholder as="p" bg="SkeletonColor" className={className} />
  </Placeholder>
);

const SkeletonLoader = () => {
// SkeletonComponents that are repeated 3 or more times are rendered
// with the map function using the arrays below.
// Each array has incremental values i.e [1, 2, 3...] that is passed into the key.
  const skeletonStatusBox = Array(6).fill(1).map((_, i) => i + 1);
  const skeletonTabs = Array(3).fill(1).map((_, i) => i + 1);

  return (
    <>
      <div className="StatusBox">
        <div className="StatusBoxHeader">
          <SkeletonComponent className="SkeletonApplicationNumber" />
          <SkeletonComponent className="SkeletonButton" />
        </div>
        <div className="SkeletonStatusBox">
          {skeletonStatusBox.map((key) => (
            <SkeletonComponent key={key} className="SkeletonStatusBoxDetail" />
          ))}
        </div>
      </div>
      <div className="SkeletonContentBox">
        <div className="FormPanel">
          <div className="SkeletonTabContainer">
            {skeletonTabs.map((key) => (
              <SkeletonComponent key={key} className="SkeletonTab" />
            ))}
          </div>
        </div>
        {/* to avoid warnings of missing key when using array.map */}
        <SkeletonComponent className="SkeletonTitle" />
        <SkeletonComponent className="SkeletonBlock" />
        <SkeletonComponent className="SkeletonTitle" />
        <SkeletonComponent className="SkeletonBlock" />
        <div className="SkeletonNavigationBar">
          <SkeletonComponent className="SkeletonButton" />
          <SkeletonComponent className="SkeletonButton" />
        </div>
      </div>
    </>
  );
};

export default SkeletonLoader;
