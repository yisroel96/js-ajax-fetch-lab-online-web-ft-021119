require( './helpers' );
const chai = require( 'chai' );
const spies = require( 'chai-spies' );
const nock = require( 'nock' );
chai.use( spies );

describe('index', () => {
 

  it('does not commit token', () => {
    expect(getToken()).to.equal('');
  });

  describe('index.html', () => {
    it('creates a div with an id of "issues"', () => {
  
      expect(document.getElementById('issues')).to.exist;
    });
  });

  describe('fetch functions', () => {
    
    before(() => {
      window.fetch = require('node-fetch');
      chai.spy.on( window, 'fetch' );
      window.onerror = undefined;
    });

   


    it('fetches the create fork api', async () => {
      let reqBody
      let headers

      nock( 'https://api.github.com' )
        .post( '/repos/learn-co-curriculum/js-ajax-fetch-lab/forks' )
        .reply( 201, function ( uri, requestBody ) {
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );
        
      await forkRepo();
        
      expect( window.fetch, "A fetch to the https://api.github.com/repos/learn-co-curriculum/js-ajax-fetch-lab/forks was not found" )
      .to.have.been.called.with( 'https://api.github.com/repos/learn-co-curriculum/js-ajax-fetch-lab/forks' );
      expect( window.fetch )
        .to.have.been.called.exactly( 1 );
      expect( headers[ 'authorization' ][ 0 ] )
        .to.include( 'token' )
        
    });

    it('fetches the create issue api', async () => {
      let reqBody
      let headers
      
      nock( 'https://api.github.com' )
        .post( `/repos/${user}/js-ajax-fetch-lab/issues` )
        .reply( 201, function ( uri, requestBody ) {
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );

        
      document.getElementById('title').value = 'test';
      document.getElementById('body').value = 'test body';

      await createIssue();

      expect( window.fetch, `A POST request to the https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues was not found` )
      .to.have.been.called.with( `https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues` );
      
      expect( headers[ 'authorization' ][ 0 ] )
        .to.include( 'token' )
      expect(reqBody).to.match(/test body/);
    });

    it('fetches the get issues api', async () => {
      let reqBody
      let headers
      
      nock( 'https://api.github.com' )
        .get( `/repos/${user}/js-ajax-fetch-lab/issues` )
        .reply( 201, function ( uri, requestBody ) {
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );

      await getIssues();

      expect( window.fetch, `A GET request to the https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues was not found` )
      .to.have.been.called.with( `https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues` );
      
      expect( headers[ 'authorization' ][ 0 ] )
        .to.include( 'token' )
    
    });
  });
});
