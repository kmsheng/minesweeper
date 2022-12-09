describe('Beginner Mode', () => {

  const getDebugBtn = () => cy.get('[data-cy="debug"]')
  const getFace = () => cy.get('[data-cy="face"]')
  const getCell = key => cy.get(`[data-cy-pos="${key}"]`)
  const minePosArr = ['0:0', '1:3', '3:0', '3:2', '4:0', '5:5', '6:7', '7:1', '7:4', '7:5']

  beforeEach(() => {
    cy.visit(`http://localhost:3000/?pos=${minePosArr.join(',')}`)
  })

  it('can toggle debug mode', () => {
    getDebugBtn().click()
    cy.get('[data-cy="cell-mask"]').should('have.css', 'opacity', '0.5')
  })

  it('can sweep multiple empty cells', () => {
    getDebugBtn().click()
    getCell('2:6').click()

    const emptyPosArr = [
      '0:5', '0:6', '0:7',
      '1:5', '1:6', '1:7',
      '2:5', '2:6', '2:7',
      '3:4', '3:5', '3:6', '3:7',
      '4:7'
    ]
    emptyPosArr.forEach(key => {
      getCell(key).should('have.text', '')
    })
  })

  it('can lose the game', () => {
    getDebugBtn().click()
    getCell('0:0').click()
    getFace().should('have.text', 'x_x')
  })

  it('can win the game', () => {
    getDebugBtn().click()
    cy.get('[data-cy="cell"]').each($el => {
      cy.wrap($el).invoke('data', 'cyPos')
        .then(key => {
          if (! minePosArr.includes(key)) {
            cy.wrap($el).click()
          }
        })
    })
    getFace().should('have.text', '*()*')
  })
})
