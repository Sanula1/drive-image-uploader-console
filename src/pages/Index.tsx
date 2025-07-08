// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'white'}}>
      <div className="text-center">
        <h1 style={{color: 'black', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px'}}>
          🔧 Testing Preview - Can you see this?
        </h1>
        <p style={{color: 'gray', fontSize: '18px'}}>
          If you can see this message, the preview is working!
        </p>
        <div style={{marginTop: '20px', padding: '10px', backgroundColor: 'lightblue', borderRadius: '8px'}}>
          <p style={{color: 'black'}}>Preview Status: ✅ WORKING</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
