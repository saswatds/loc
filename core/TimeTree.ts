import BTree from "sorted-btree";

export enum Ordering {
  LESSER,
  GREATER,
  EQUAL
}

type NodeId = [number, number, number]

interface Node {
  id : () => NodeId
}

abstract class DateTimeBTree<T extends Node> {
  protected child: BTree<NodeId, T>;

  constructor() {
    this.child = new BTree(undefined, (a, b) => {
      switch(Day.compare(a, b)) {
        case Ordering.GREATER: return 1;
        case Ordering.EQUAL: return 0;
        case Ordering.LESSER: return -1;
      }
    })
  }

  findOrCreate(node: T): T{
    this.child.setIfNotPresent(node.id(), node)
  
    return this.child.get(node.id()) || node;
  }

  findSameOrLower(k: Day) : T | undefined {
    return  this.child.get(k.id()) || this.findLower(k);
  }

  findLower(k: Day): T | undefined {
    return this.child.nextLowerPair(k.id())?.[1];
  }

  findSameOrHigher(k: Day) : T | undefined {
    return  this.child.get(k.id()) || this.findHigher(k);
  }

  findHigher(k: Day): T | undefined {
    return this.child.nextHigherPair(k.id())?.[1];
  }
}

class Day implements Node {
  month: number;
  year: number;
  day: number
  next: Day | null;

  private _events: Set<any>;

  constructor (year: number, month: number, day: number) {
    this.year = year;
    this.month= month;
    this.day = day;

    this._events = new Set();
    this.next = null;
  }

  id(): NodeId {
    return [this.year, this.month, this.day];
  }

  addEvent(event: any) {
    this._events.add(event);
  }

  events() {
    return [...this._events.values()];
  }

  static compare (first: NodeId, second: NodeId) {
    if (first[0] < second[0]) {
      return Ordering.LESSER;
    }

    if (first[0] > second[0]) {
      return Ordering.GREATER;
    }

    // Year is same compare month
    if(first[1] < second[1]) {
      return Ordering.LESSER;
    }

    if(first[1] > second[1]) {
      return Ordering.GREATER
    }

    // Month is also same
    if(first[2] < second[2]) {
      return Ordering.LESSER;
    }

    if(first[2] > second[2]) {
      return Ordering.GREATER
    }

    // There two objects are objects of the same day
    return Ordering.EQUAL;
  }

  static traverse(start: Day | null = null, end: Day| null = null): any[] {
    // If there is no starting tracker then bail
    if(!start) {
      return [];
    }

    // If the start equal end then only return the start
    if(start === end) {
      return start.events();
    }

    const events = [];

    // Stop if we run out of tracker or we reach the end
    for( let tracker: Day | null = start; tracker; tracker = tracker.next) {
        events.push(tracker.events());

        if(tracker == end)  break;
    }

    return events.flat();
  }

  static fromDate(date: Date): Day {
    return new Day(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

class LinkedDayNodes extends DateTimeBTree<Day> {
  dls: Day; // Linked-List start
  dle: Day; // Linked-List end

  constructor() {
    super();
    this.dls = new Day(Infinity, Infinity, Infinity); // Starting with no start node
    this.dle = new Day(-Infinity,-Infinity,-Infinity); // Starting with no end node
  }

  index(d: Day){
    const dFromStart = Day.compare(d.id(), this.dls.id());
    const dFromEnd = Day.compare(d.id(), this.dle.id());

    // This is already one of the edge nodes being added again. Nothing to do here
    if(dFromStart === Ordering.EQUAL || dFromEnd === Ordering.EQUAL) {
      return;
    }

    // If the new node coming is smaller than dls then replace
    if(dFromStart === Ordering.LESSER) {
      d.next = this.dls;
      this.dls = d;
    }

    if(dFromEnd === Ordering.GREATER) {
      this.dle.next = d;
      this.dle = d;
      this.dle.next = null;
    }

    // It's in between first and last node then we need to traverse and link it
    if(dFromStart === Ordering.GREATER && dFromEnd === Ordering.LESSER) {
      // Start with the first node
      let pointer: Day | null = this.dls;

      // Find until the next node is greater or equal
    
      // Loop until there is a pointer
      while(pointer) {
        // Get the next pointer
        const next: Day | null = pointer.next;

        if(!next) {
          break;
        }

        // Check if the next node is greater than the d then time to breakout
        // The next item is greater the current date hence we will have to
        // place the current node in-between the current node and next node
        if(Day.compare(next.id(), d.id()) === Ordering.GREATER){
          break;
        }

        // If can next is null pointer will be set to null and it will break out
        // of this loop
        pointer = next;
      }

      // No pointer was found which should never happen
      if(!pointer.next) {
        
        throw new Error('No pointer found to index day');
      }

      // the d and pointer are same then bail as its already indexed
      if(Day.compare(d.id(), pointer.id()) === Ordering.EQUAL) {
        return;
      }

      // Inject into the linked list between the pointer and it's next value
      d.next = pointer.next;
      pointer.next = d;
    }
  }
}

export default class TimeTree {
  private dates: LinkedDayNodes;

  constructor() {
    this.dates = new LinkedDayNodes();
  }

  addEvent(time: Date, event: any) {
    const dayNode: Day = this.dates.findOrCreate(Day.fromDate(time));

    // add the event to the day node
    dayNode.addEvent(event);

    // Index this dayNode
    this.dates.index(dayNode);
  }

  query(start: Date, end: Date, includeEnd: boolean = true) {
    let startDay: Day | undefined = this.dates.findSameOrHigher(Day.fromDate(start));
    let endDay: Day | undefined = includeEnd ? 
      this.dates.findSameOrLower(Day.fromDate(end)) : 
      this.dates.findLower(Day.fromDate(end));
  
    return Day.traverse(startDay, endDay);
  }

  all() {
    return Day.traverse(this.dates.dls);
  }
}