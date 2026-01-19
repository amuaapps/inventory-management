import Image from 'next/image';

const Icon = () => {
  return (
    <Image
      src="/icon.svg"
      alt="Amua Apps Icon"
      width={32}
      height={32}
      priority
      style={{ width: '32px', height: '32px' }}
    />
  );
};

export default Icon;
