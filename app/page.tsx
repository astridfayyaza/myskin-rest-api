export default function Home() {
  return (
    <div style={{
      fontFamily: 'monospace',
      color: '#333',
      backgroundColor: '#fff',
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', fontSize: '24px' }}>
        MYSKIN REST API DOCS
      </h1>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Production serverless App Router backend pipeline built natively with Next.js, Neon PostgreSQL, and Vercel Blob.
      </p>

      <h2 style={{ fontSize: '18px', marginTop: '30px', textTransform: 'uppercase' }}>1. Base Configuration</h2>
      <hr style={{ border: '0', borderTop: '1px solid #ccc' }} />
      <ul style={{ listStyleType: 'square', paddingLeft: '20px', fontSize: '14px' }}>
        <li><strong>Base URL:</strong> <code>https://your-vercel-domain.vercel.app/</code></li>
        <li><strong>Authentication:</strong> Google OAuth ID Token (JWT) via <code>Authorization</code> header.</li>
      </ul>

      <h2 style={{ fontSize: '18px', marginTop: '40px', textTransform: 'uppercase' }}>2. Endpoints</h2>
      
      {/* GET */}
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>GET /api/skincare</strong></p>
        <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
          Queries Neon PostgreSQL. Filters items owned by 'system' or matching the token payload's email claim.
        </p>
        <pre style={{ backgroundColor: '#eee', padding: '10px', fontSize: '13px', overflowX: 'auto' }}>
{`[
  {
    "id": "1",
    "nama": "Hydrating Cleanser",
    "brand": "CeraVe",
    "imageId": "https://...",
    "mine": 0
  }
]`}
        </pre>
      </div>

      {/* POST */}
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>POST /api/skincare</strong></p>
        <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
          Parses native <code>request.formData()</code>. Uploads file binaries directly to Vercel Blob and inserts rows into Neon DB.
        </p>
        <pre style={{ backgroundColor: '#eee', padding: '10px', fontSize: '13px', overflowX: 'auto' }}>
{`{
  "status": "success",
  "message": "Saved successfully!"
}`}
        </pre>
      </div>

      {/* DELETE */}
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>DELETE /api/skincare?id=[item_id]</strong></p>
        <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
          Deletes a record if the creator matches the authorization credentials.
        </p>
      </div>

      {/* IMAGE */}
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>GET /api/image?id=[image_id]</strong></p>
        <p style={{ fontSize: '14px', margin: '0' }}>
          Resolves media requests via 302 redirection to the storage CDN or default placeholders.
        </p>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        End of Document.
      </p>
    </div>
  );
}