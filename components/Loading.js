import Image from 'next/image';

const Loading = () => {
  return (
    <center style={{ display: 'gird', placeItems: 'center', height: '100vh' }}>
      <div>
        <Image
          src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'
          alt='Whatsapp logo'
          style={{ marginBottom: 10 }}
          height={200}
        />
        <h1>Loading...</h1>
      </div>
    </center>
  );
};

export default Loading;
