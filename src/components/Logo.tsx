import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src="/logo.svg"
      alt="Amua Apps"
      width={150}
      height={40}
      priority
      style={{ width: 'auto', height: '40px' }}
    />
  );
};

export default Logo;
