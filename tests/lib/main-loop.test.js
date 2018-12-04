const mainLoop = require('../../lib/utils/main-loop')
const { loadDiff } = require('../helpers')

describe('main-loop', () => {
  let context, handler

  beforeEach(() => {
    context = {
      event: 'push',
      repo: (obj) => ({
        owner: 'JasonEtco',
        repo: 'todo',
        ...obj
      }),
      github: {
        issues: {
          createLabel: jest.fn()
        },
        repos: {
          getCommit: jest.fn(() => loadDiff('basic')).mockName('repos.getCommit')
        }
      }
    }

    handler = jest.fn()
  })

  it('uses the default config if context.config return value does not have todo', async () => {
    context.config = jest.fn(() => Promise.resolve({
      pizza: true
    }))

    await mainLoop(context, handler)
    expect(handler).toHaveBeenCalled()
  })

  it('throws on an invalid config', async () => {
    expect.assertions(2)

    context.config = jest.fn(() => Promise.resolve({
      todo: { pizza: true }
    }))

    try {
      await mainLoop(context, handler)
    } catch (err) {
      expect(err).toMatchSnapshot()
    }

    expect(handler).not.toHaveBeenCalled()
  })
})
