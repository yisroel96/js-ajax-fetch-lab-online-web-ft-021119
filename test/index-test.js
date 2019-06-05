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
    
    beforeEach(() => {
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
          console.log(requestBody)
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );
        
      await forkRepo();
        
      expect(window.fetch.__spy.called, "fetch was not called in forkRepo").to.eq(true)
      expect( window.fetch, "A fetch to the https://api.github.com/repos/learn-co-curriculum/js-ajax-fetch-lab/forks was not found" )
      .to.have.been.called.with( 'https://api.github.com/repos/learn-co-curriculum/js-ajax-fetch-lab/forks' );
    
      expect(headers[ 'authorization' ], 'Authorization header not found').to.exist
      expect( headers[ 'authorization' ][ 0 ], 'Authorization header expected to point to "token " without the actual token' )
        .to.eq( 'token ' )
        
    });

    it('fetches the create issue api', async () => {
      let reqBody
      let headers
      
      nock( 'https://api.github.com' )
        .get( `/repos/${user}/js-ajax-fetch-lab/issues` )
        .reply( 201, function ( uri, requestBody ) {
          // console.log(this.req)
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } )

      nock( 'https://api.github.com' )
        .post( `/repos/${user}/js-ajax-fetch-lab/issues` )
        .reply( 201, function ( uri, requestBody ) {
          // console.log(this.req)
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );

        
      document.getElementById('title').value = 'test';
      document.getElementById('body').value = 'test body';

      await createIssue();

      expect(window.fetch.__spy.called, "fetch was not called in createIssue").to.eq(true)
      expect( window.fetch, `A POST request to the https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues was not found` )
      .to.have.been.called.with( `https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues` );
      expect(window.fetch.__spy.calls[0][0], 'Do not post issues to learn-co-curriculum, post them to your own fork').to.not.match(/learn-co-curriculum/)
      expect(headers[ 'authorization' ], 'Authorization header not found').to.exist
      expect( headers[ 'authorization' ][ 0 ], 'Authorization header expected to point to "token " without the actual token' )
        .to.eq( 'token ' )
      expect(reqBody).to.match(/test body/);
    });

    it('fetches the get issues api', async () => {
      let reqBody
      let headers
      
      nock( 'https://api.github.com' )
        .get( `/repos/${user}/js-ajax-fetch-lab/issues` )
        .reply( 201, function ( uri, requestBody ) {
          // console.log(this.req)
          reqBody = requestBody
          headers = this.req.headers
          return {
            ...requestBody
          }
        } );

      await getIssues();

      expect(window.fetch.__spy.called, "fetch was not called in getIssues").to.eq(true)
      expect( window.fetch, `A GET request to the https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues was not found` )
      .to.have.been.called.with( `https://api.github.com/repos/${user}/js-ajax-fetch-lab/issues` );
      expect(window.fetch.__spy.calls[0][0], 'Do not get issues from the learn-co-curriculum repo, retrieve them from your own fork').to.not.match(/learn-co-curriculum/)
      expect(headers[ 'authorization' ], 'Authorization header not found').to.exist
      expect( headers[ 'authorization' ][ 0 ], 'Authorization header expected to point to "token " without the actual token' )
        .to.eq( 'token ' )
    
    });
  });
});
