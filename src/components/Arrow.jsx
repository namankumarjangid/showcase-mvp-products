const Arrow = ({ direction = 'up' }) => (
  <img
    src="/icons/arrow-up.png"
    style={{
      transform: direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)',
      transition: 'transform 0.2s ease-in-out',
    }}
    width={15}
    alt="arrow up"
    className="arrow"
  />
);

export default Arrow;
