import { OutstandingQueries, Query } from '../outstanding-queries.js'
import { StreamID } from '@ceramicnetwork/streamid'
import { assert } from 'console'

const FAKE_STREAM_ID = StreamID.fromString(
  'kjzl6cwe1jw147dvq16zluojmraqvwdmbh61dx9e0c59i344lcrsgqfohexp60s'
)

const outstandingQueries: OutstandingQueries = new OutstandingQueries()

describe('Prioritized Queue', () => {
  beforeEach(() => {
    outstandingQueries.queryMap.clear()
    outstandingQueries.queryQueue.clear()
  })

  test('Prioritized Queue front verification, increasing priority', async () => {
    const t1 = new Date('2011-04-11T10:20:30Z').getTime()
    const t2 = new Date('2011-04-11T11:20:30Z').getTime()
    const t3 = new Date('2011-04-11T12:20:30Z').getTime()
    const q1 = new Query(t1, FAKE_STREAM_ID, 'a')
    const q2 = new Query(t2, FAKE_STREAM_ID, 'b')
    const q3 = new Query(t3, FAKE_STREAM_ID, 'c')
    outstandingQueries.queryQueue.enqueue(q1)
    outstandingQueries.queryQueue.enqueue(q2)
    outstandingQueries.queryQueue.enqueue(q3)
    const front = outstandingQueries.queryQueue.front()
    const equal = q1.timestamp === q3.timestamp
    assert(!equal)
    expect(front.timestamp).toEqual(t1)
  })

  test('Prioritized Queue front verification, decreasing priority', async () => {
    const t1 = new Date('2011-04-11T10:20:30Z').getTime()
    const t2 = new Date('2011-04-11T11:20:30Z').getTime()
    const t3 = new Date('2011-04-11T12:20:30Z').getTime()
    const q1 = new Query(t3, FAKE_STREAM_ID, 'a')
    const q2 = new Query(t2, FAKE_STREAM_ID, 'b')
    const q3 = new Query(t1, FAKE_STREAM_ID, 'c')
    outstandingQueries.queryQueue.enqueue(q1)
    outstandingQueries.queryQueue.enqueue(q2)
    outstandingQueries.queryQueue.enqueue(q3)
    const front = outstandingQueries.queryQueue.front()
    expect(front.timestamp).toEqual(t1)
  })

  test('Prioritized Queue size verification', async () => {
    const t1 = new Date('2011-04-11T10:20:30Z').getTime()
    const t2 = new Date('2011-04-11T11:20:30Z').getTime()
    const t3 = new Date('2011-04-11T12:20:30Z').getTime()
    const q1 = new Query(t1, FAKE_STREAM_ID, 'a')
    const q2 = new Query(t2, FAKE_STREAM_ID, 'b')
    const q3 = new Query(t3, FAKE_STREAM_ID, 'c')
    outstandingQueries.queryQueue.enqueue(q1)
    outstandingQueries.queryQueue.enqueue(q2)
    outstandingQueries.queryQueue.enqueue(q3)
    const size = outstandingQueries.queryQueue.size()
    expect(size).toEqual(3)
  })

  test('Prioritized Queue verify queue empty after clean up', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const q1 = new Query(t1, FAKE_STREAM_ID, 'a')
    outstandingQueries.queryQueue.enqueue(q1)
    outstandingQueries.queryMap.set('a', q1)
    assert(outstandingQueries.queryQueue.front() == q1)
    assert(outstandingQueries.queryMap.get('a') == q1)
    console.log('outstandingQueries.queryQueue - before')
    console.log(outstandingQueries.queryQueue)
    console.log(outstandingQueries.queryMap)
    outstandingQueries.cleanUpExpiredQueries()
    console.log('outstandingQueries.queryQueue - after')
    console.log(outstandingQueries.queryQueue)
    console.log(outstandingQueries.queryMap)
    expect(outstandingQueries.queryQueue.isEmpty()).toEqual(true)
  })

  test('Prioritized Queue verify map empty after clean up', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const q1 = new Query(t1, FAKE_STREAM_ID, 'a')
    outstandingQueries.queryQueue.enqueue(q1)
    outstandingQueries.queryMap.set('a', q1)
    assert(outstandingQueries.queryQueue.front() == q1)
    assert(outstandingQueries.queryMap.get('a') == q1)
    console.log('outstandingQueries.queryMap - before')
    console.log(outstandingQueries.queryQueue)
    console.log(outstandingQueries.queryMap)
    outstandingQueries.cleanUpExpiredQueries()
    console.log('outstandingQueries.queryMap - after')
    console.log(outstandingQueries.queryQueue)
    console.log(outstandingQueries.queryMap)
    expect(outstandingQueries.queryMap.size).toEqual(0)
  })
})

describe('Outstanding Queries', () => {
  beforeEach(() => {
    outstandingQueries.queryMap.clear()
    outstandingQueries.queryQueue.clear()
  })

  test('Oustanding Queries, Add Query', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const q1 = new Query(t1, FAKE_STREAM_ID, 'a')
    const testQueryID = 'testID'
    outstandingQueries.add(testQueryID, q1)
    expect(outstandingQueries.queryMap.size).toEqual(1)
    expect(outstandingQueries.queryQueue.size()).toEqual(1)
  })

  test('Oustanding Queries, Remove Query', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const testQueryID = 'testID'
    const q1 = new Query(t1, FAKE_STREAM_ID, testQueryID)
    outstandingQueries.add(testQueryID, q1)
    assert(outstandingQueries.queryMap.size === 1)
    assert(outstandingQueries.queryQueue.size() === 1)
    outstandingQueries.remove(q1)
    expect(outstandingQueries.queryMap.size).toEqual(0)

    expect(outstandingQueries.queryQueue.size()).toEqual(0)
  })

  test('Oustanding Queries, cleanUpExpiredQueries', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const testQueryID = 'testID'
    const q1 = new Query(t1, FAKE_STREAM_ID, testQueryID)
    outstandingQueries.add(testQueryID, q1)
    assert(outstandingQueries.queryMap.size === 1)
    assert(outstandingQueries.queryQueue.size() === 1)
    outstandingQueries.cleanUpExpiredQueries()
    expect(outstandingQueries.queryMap.size).toEqual(0)
    expect(outstandingQueries.queryQueue.size()).toEqual(0)
  })

  test('Oustanding Queries, restrict duplicate outstanding queries', async () => {
    const t1 = new Date('2022-05-12T10:20:30Z').getTime()
    const testQueryID = 'testID'
    const q1 = new Query(t1, FAKE_STREAM_ID, testQueryID)
    outstandingQueries.add(testQueryID, q1)
    expect(!outstandingQueries.add(testQueryID, q1))
  })
})
