export const seedProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Table"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    inputFormat: "nums: Array of integers, target: integer",
    outputFormat: "Array of two integer indices [i, j]",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
    
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }),
        expectedOutput: JSON.stringify([0, 1]),
        isHidden: false,
        isEdgeCase: false,
        description: "Standard positive array"
      },
      {
        id: 2,
        input: JSON.stringify({ nums: [3, 2, 4], target: 6 }),
        expectedOutput: JSON.stringify([1, 2]),
        isHidden: false,
        isEdgeCase: false,
        description: "Indices not at start"
      },
      {
        id: 3,
        input: JSON.stringify({ nums: [3, 3], target: 6 }),
        expectedOutput: JSON.stringify([0, 1]),
        isHidden: true,
        isEdgeCase: true,
        description: "Duplicate values"
      },
      {
        id: 4,
        input: JSON.stringify({ nums: [-1, -2, -3, -4, -5], target: -8 }),
        expectedOutput: JSON.stringify([2, 4]),
        isHidden: true,
        isEdgeCase: true,
        description: "Negative integers"
      },
      {
        id: 5,
        input: JSON.stringify({ nums: [0, 4, 3, 0], target: 0 }),
        expectedOutput: JSON.stringify([0, 3]),
        isHidden: true,
        isEdgeCase: true,
        description: "Zero target with zero values"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "A brute force approach checks every pair with two nested loops in O(N^2) time. Can you find a way to check if the complement (target - current) has already been seen in O(1) time?"
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Consider using a Hash Map (or JavaScript Map/Object, Python dictionary) to store elements you have already visited along with their indices."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Iterate through the array once. For each element `num` at index `i`, compute `complement = target - num`. If `complement` exists in the map, return `[map[complement], i]`. Otherwise, store `map[num] = i`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `map = empty hash map
for i from 0 to nums.length - 1:
    diff = target - nums[i]
    if diff exists in map:
        return [map[diff], i]
    map[nums[i]] = i
return []`
      }
    ]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    topics: ["Strings", "Stack"],
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "s: string consisting of parentheses",
    outputFormat: "boolean (true if valid, false otherwise)",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      {
        input: "s = '()'",
        output: "true",
        explanation: "Simple matching parentheses."
      },
      {
        input: "s = '()[]{}'",
        output: "true",
        explanation: "Multiple matching pairs in sequence."
      },
      {
        input: "s = '(]'",
        output: "false",
        explanation: "Mismatched bracket type."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your solution here
    
}`,
      python: `def is_valid(s: str) -> bool:
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ s: "()" }),
        expectedOutput: "true",
        isHidden: false,
        isEdgeCase: false,
        description: "Simple pair"
      },
      {
        id: 2,
        input: JSON.stringify({ s: "()[]{}" }),
        expectedOutput: "true",
        isHidden: false,
        isEdgeCase: false,
        description: "Sequential valid brackets"
      },
      {
        id: 3,
        input: JSON.stringify({ s: "(]" }),
        expectedOutput: "false",
        isHidden: false,
        isEdgeCase: false,
        description: "Mismatched types"
      },
      {
        id: 4,
        input: JSON.stringify({ s: "([)]" }),
        expectedOutput: "false",
        isHidden: true,
        isEdgeCase: true,
        description: "Interleaved invalid order"
      },
      {
        id: 5,
        input: JSON.stringify({ s: "{[]}" }),
        expectedOutput: "true",
        isHidden: true,
        isEdgeCase: false,
        description: "Properly nested brackets"
      },
      {
        id: 6,
        input: JSON.stringify({ s: "[" }),
        expectedOutput: "false",
        isHidden: true,
        isEdgeCase: true,
        description: "Single unclosed opening bracket"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Brackets operate in a Last-In First-Out (LIFO) manner. The most recently opened bracket must be the first one closed."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "A Stack is the classic data structure for matching nested delimiters."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Push opening brackets onto a stack. When encountering a closing bracket, check if the stack is non-empty and the top matches. If matching, pop it; otherwise return false. At the end, return true only if the stack is empty."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `stack = []
bracketMap = { ')': '(', '}': '{', ']': '[' }
for char in s:
    if char in bracketMap:
        top = stack.pop() if stack not empty else '#'
        if bracketMap[char] != top:
            return false
    else:
        stack.push(char)
return stack is empty`
      }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window", "Hash Table"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    inputFormat: "s: string",
    outputFormat: "integer length of longest non-repeating substring",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      {
        input: "s = 'abcabcbb'",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      },
      {
        input: "s = 'bbbbb'",
        output: "1",
        explanation: "The answer is 'b', with the length of 1."
      },
      {
        input: "s = 'pwwkew'",
        output: "3",
        explanation: "The answer is 'wke', with the length of 3. Notice 'pwke' is a subsequence, not a substring."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Write your solution here
    
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ s: "abcabcbb" }),
        expectedOutput: "3",
        isHidden: false,
        isEdgeCase: false,
        description: "Repeats across string"
      },
      {
        id: 2,
        input: JSON.stringify({ s: "bbbbb" }),
        expectedOutput: "1",
        isHidden: false,
        isEdgeCase: false,
        description: "All identical characters"
      },
      {
        id: 3,
        input: JSON.stringify({ s: "pwwkew" }),
        expectedOutput: "3",
        isHidden: false,
        isEdgeCase: false,
        description: "Internal repeat"
      },
      {
        id: 4,
        input: JSON.stringify({ s: "" }),
        expectedOutput: "0",
        isHidden: true,
        isEdgeCase: true,
        description: "Empty string edge case"
      },
      {
        id: 5,
        input: JSON.stringify({ s: " " }),
        expectedOutput: "1",
        isHidden: true,
        isEdgeCase: true,
        description: "Single space character"
      },
      {
        id: 6,
        input: JSON.stringify({ s: "dvdf" }),
        expectedOutput: "3",
        isHidden: true,
        isEdgeCase: true,
        description: "Overlapping substring restart"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Rather than re-evaluating every substring from scratch (O(N^3) or O(N^2)), maintain a moving contiguous window of unique characters."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "A Sliding Window technique with two pointers `left` and `right`, combined with a Map that records the last seen index of each character."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Expand `right` across the string. If `s[right]` was seen at an index `>= left`, jump `left` to `lastIndex + 1`. Calculate window length `right - left + 1` and update `maxLen`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `seen = {}
left = 0
maxLen = 0
for right in range(len(s)):
    char = s[right]
    if char in seen and seen[char] >= left:
        left = seen[char] + 1
    seen[char] = right
    maxLen = max(maxLen, right - left + 1)
return maxLen`
      }
    ]
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    inputFormat: "intervals: Array of [start, end] pairs",
    outputFormat: "Array of merged [start, end] pairs",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    // Write your solution here
    
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
        return new int[][]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here
        return {};
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }),
        expectedOutput: JSON.stringify([[1, 6], [8, 10], [15, 18]]),
        isHidden: false,
        isEdgeCase: false,
        description: "Standard overlapping intervals"
      },
      {
        id: 2,
        input: JSON.stringify({ intervals: [[1, 4], [4, 5]] }),
        expectedOutput: JSON.stringify([[1, 5]]),
        isHidden: false,
        isEdgeCase: false,
        description: "Touching boundaries"
      },
      {
        id: 3,
        input: JSON.stringify({ intervals: [[1, 4], [2, 3]] }),
        expectedOutput: JSON.stringify([[1, 4]]),
        isHidden: true,
        isEdgeCase: true,
        description: "Fully contained interval"
      },
      {
        id: 4,
        input: JSON.stringify({ intervals: [[1, 4]] }),
        expectedOutput: JSON.stringify([[1, 4]]),
        isHidden: true,
        isEdgeCase: true,
        description: "Single interval"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "If the intervals are unsorted, determining overlaps requires checking every pair. How does sorting help simplify the problem?"
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Sort the intervals primarily by their start times `intervals.sort((a, b) => a[0] - b[0])`."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "After sorting by start time, iterate through each interval. If the current interval's start is <= the end of the previous interval in your result list, merge them by updating `previous.end = max(previous.end, current.end)`. Otherwise, append the current interval."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `intervals.sort_by_start_time()
merged = [intervals[0]]
for current in intervals[1:]:
    last = merged[-1]
    if current.start <= last.end:
        last.end = max(last.end, current.end)
    else:
        merged.append(current)
return merged`
      }
    ]
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    topics: ["Arrays", "Binary Search"],
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    inputFormat: "nums: sorted integer array, target: integer",
    outputFormat: "integer index or -1",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4"
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1"
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Write your solution here
    
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ nums: [-1, 0, 3, 5, 9, 12], target: 9 }),
        expectedOutput: "4",
        isHidden: false,
        isEdgeCase: false,
        description: "Target present in right half"
      },
      {
        id: 2,
        input: JSON.stringify({ nums: [-1, 0, 3, 5, 9, 12], target: 2 }),
        expectedOutput: "-1",
        isHidden: false,
        isEdgeCase: false,
        description: "Target absent"
      },
      {
        id: 3,
        input: JSON.stringify({ nums: [5], target: 5 }),
        expectedOutput: "0",
        isHidden: true,
        isEdgeCase: true,
        description: "Single element found"
      },
      {
        id: 4,
        input: JSON.stringify({ nums: [5], target: -5 }),
        expectedOutput: "-1",
        isHidden: true,
        isEdgeCase: true,
        description: "Single element missing"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Since the array is sorted, every comparison with the middle element lets you discard half of the search space."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Use two pointers: `low = 0` and `high = nums.length - 1`."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "While `low <= high`, compute `mid = Math.floor((low + high) / 2)`. If `nums[mid] === target`, return `mid`. If `nums[mid] < target`, set `low = mid + 1`. Otherwise set `high = mid - 1`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `low = 0, high = len(nums) - 1
while low <= high:
    mid = low + (high - low) // 2
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
return -1`
      }
    ]
  },
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    description: "Given the head of a singly linked list represented as an array of values, reverse the list, and return the reversed list.",
    inputFormat: "head: array representing linked list node values",
    outputFormat: "reversed array of node values",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The direction of pointers is reversed."
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "Two elements swapped order."
      },
      {
        input: "head = []",
        output: "[]",
        explanation: "Empty list reverses to empty list."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} head
 * @return {number[]}
 */
function reverseList(head) {
    // Write your solution here (reverse the node order)
    
}`,
      python: `def reverse_list(head: list[int]) -> list[int]:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] reverseList(int[] head) {
        // Write your solution here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> reverseList(vector<int>& head) {
        // Write your solution here
        return {};
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ head: [1, 2, 3, 4, 5] }),
        expectedOutput: JSON.stringify([5, 4, 3, 2, 1]),
        isHidden: false,
        isEdgeCase: false,
        description: "5 elements standard"
      },
      {
        id: 2,
        input: JSON.stringify({ head: [1, 2] }),
        expectedOutput: JSON.stringify([2, 1]),
        isHidden: false,
        isEdgeCase: false,
        description: "2 elements"
      },
      {
        id: 3,
        input: JSON.stringify({ head: [] }),
        expectedOutput: JSON.stringify([]),
        isHidden: true,
        isEdgeCase: true,
        description: "Empty list"
      },
      {
        id: 4,
        input: JSON.stringify({ head: [42] }),
        expectedOutput: JSON.stringify([42]),
        isHidden: true,
        isEdgeCase: true,
        description: "Single element list"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "To reverse a linked list, each node's `next` pointer must point to the previous node instead of the forward node."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Maintain three pointer references: `prev`, `curr`, and `nextTemp`."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Initialize `prev = null`. While `curr` is not null: save `nextTemp = curr.next`, point `curr.next = prev`, advance `prev = curr`, and advance `curr = nextTemp`. Finally return `prev`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `prev = null
curr = head
while curr is not null:
    nextTemp = curr.next
    curr.next = prev
    prev = curr
    curr = nextTemp
return prev`
      }
    ]
  },
  {
    title: "Detect Cycle in Linked List",
    slug: "detect-cycle-in-linked-list",
    difficulty: "Medium",
    topics: ["Linked List", "Two Pointers"],
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. `pos` represents the index of the node that tail's next pointer is connected to (-1 if no cycle). Return true if there is a cycle, or false otherwise.",
    inputFormat: "head: array of values, pos: integer connecting index (-1 for none)",
    outputFormat: "boolean (true if cycle detected, false otherwise)",
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list."
    ],
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "There is a cycle where tail connects to head."
      },
      {
        input: "head = [1], pos = -1",
        output: "false",
        explanation: "No cycle in the list."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} head
 * @param {number} pos
 * @return {boolean}
 */
function hasCycle(head, pos) {
    // Write your solution here
    return pos !== -1;
}`,
      python: `def has_cycle(head: list[int], pos: int) -> bool:
    # Write your solution here
    return pos != -1`,
      java: `class Solution {
    public boolean hasCycle(int[] head, int pos) {
        // Write your solution here
        return pos != -1;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool hasCycle(vector<int>& head, int pos) {
        // Write your solution here
        return pos != -1;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ head: [3, 2, 0, -4], pos: 1 }),
        expectedOutput: "true",
        isHidden: false,
        isEdgeCase: false,
        description: "Cycle connected to node index 1"
      },
      {
        id: 2,
        input: JSON.stringify({ head: [1, 2], pos: 0 }),
        expectedOutput: "true",
        isHidden: false,
        isEdgeCase: false,
        description: "Two nodes cycle to head"
      },
      {
        id: 3,
        input: JSON.stringify({ head: [1], pos: -1 }),
        expectedOutput: "false",
        isHidden: false,
        isEdgeCase: false,
        description: "Single node without cycle"
      },
      {
        id: 4,
        input: JSON.stringify({ head: [], pos: -1 }),
        expectedOutput: "false",
        isHidden: true,
        isEdgeCase: true,
        description: "Empty linked list"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "If two runners run on a circular track with different speeds, will the faster runner eventually catch up with the slower runner?"
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different velocities."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Initialize `slow` and `fast` pointers at `head`. Advance `slow` by 1 step and `fast` by 2 steps. If `slow == fast` at any point, a cycle exists. If `fast` or `fast.next` reaches null, no cycle exists."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return true
return false`
      }
    ]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    topics: ["Arrays", "Dynamic Programming", "Divide and Conquer"],
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    inputFormat: "nums: Array of integers",
    outputFormat: "integer representing maximum subarray sum",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Write your solution here (Kadane's Algorithm)
    
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }),
        expectedOutput: "6",
        isHidden: false,
        isEdgeCase: false,
        description: "Mixed positive and negative"
      },
      {
        id: 2,
        input: JSON.stringify({ nums: [1] }),
        expectedOutput: "1",
        isHidden: false,
        isEdgeCase: false,
        description: "Single positive number"
      },
      {
        id: 3,
        input: JSON.stringify({ nums: [5, 4, -1, 7, 8] }),
        expectedOutput: "23",
        isHidden: false,
        isEdgeCase: false,
        description: "Subarray with one negative"
      },
      {
        id: 4,
        input: JSON.stringify({ nums: [-5, -2, -8, -1] }),
        expectedOutput: "-1",
        isHidden: true,
        isEdgeCase: true,
        description: "All negative numbers"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "If at any point the running sum becomes negative, would keeping that previous segment help future elements increase their sum?"
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Kadane's Algorithm keeps track of `currentSum` and `maxSum` in O(1) space."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Iterate through `nums`. At each index `i`, decide whether to add `nums[i]` to `currentSum` or start fresh from `nums[i]` (`currentSum = max(nums[i], currentSum + nums[i])`). Update `maxSum = max(maxSum, currentSum)`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `maxSum = nums[0]
currentSum = nums[0]
for num in nums[1:]:
    currentSum = max(num, currentSum + num)
    maxSum = max(maxSum, currentSum)
return maxSum`
      }
    ]
  },
  {
    title: "Kth Smallest Element in a Sorted Matrix",
    slug: "kth-smallest-element",
    difficulty: "Medium",
    topics: ["Arrays", "Binary Search", "Heap / Priority Queue"],
    description: "Given an `n x n` matrix where each of the rows and columns is sorted in ascending order, return the `kth` smallest element in the matrix.\n\nNote that it is the `kth` smallest element in sorted order, not the `kth` distinct element.",
    inputFormat: "matrix: 2D array of integers, k: integer",
    outputFormat: "integer representing kth smallest value",
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 300",
      "-10^9 <= matrix[i][j] <= 10^9",
      "All the rows and columns are sorted in non-decreasing order.",
      "1 <= k <= n^2"
    ],
    examples: [
      {
        input: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
        output: "13",
        explanation: "The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13"
      },
      {
        input: "matrix = [[-5]], k = 1",
        output: "-5",
        explanation: "Single element matrix"
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
function kthSmallest(matrix, k) {
    // Write your solution here
    
}`,
      python: `def kth_smallest(matrix: list[list[int]], k: int) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ matrix: [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k: 8 }),
        expectedOutput: "13",
        isHidden: false,
        isEdgeCase: false,
        description: "3x3 matrix, k=8"
      },
      {
        id: 2,
        input: JSON.stringify({ matrix: [[-5]], k: 1 }),
        expectedOutput: "-5",
        isHidden: false,
        isEdgeCase: false,
        description: "1x1 matrix"
      },
      {
        id: 3,
        input: JSON.stringify({ matrix: [[1, 2], [1, 3]], k: 2 }),
        expectedOutput: "1",
        isHidden: true,
        isEdgeCase: true,
        description: "Duplicate values in matrix"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Flattening and sorting takes O(N^2 log(N^2)). Since rows and columns are already sorted, you can either use a Min-Heap or Binary Search on the value range."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Binary Search on values: `low = matrix[0][0]` and `high = matrix[n-1][n-1]`."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "For a guessed `mid` value, count how many elements in the matrix are `<= mid` in O(N) time starting from the bottom-left corner. If count < k, `low = mid + 1`, otherwise `high = mid`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `low = matrix[0][0], high = matrix[-1][-1]
while low < high:
    mid = (low + high) // 2
    count = countLessOrEqual(matrix, mid)
    if count < k:
        low = mid + 1
    else:
        high = mid
return low`
      }
    ]
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    topics: ["Dynamic Programming", "Breadth-First Search"],
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    inputFormat: "coins: integer array, amount: integer target",
    outputFormat: "minimum number of coins or -1",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1"
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot form 3 using only 2s"
      },
      {
        input: "coins = [1], amount = 0",
        output: "0",
        explanation: "0 coins needed to make amount 0"
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    // Write your solution here
    
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your solution here
        return -1;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ coins: [1, 2, 5], amount: 11 }),
        expectedOutput: "3",
        isHidden: false,
        isEdgeCase: false,
        description: "Standard denominations"
      },
      {
        id: 2,
        input: JSON.stringify({ coins: [2], amount: 3 }),
        expectedOutput: "-1",
        isHidden: false,
        isEdgeCase: false,
        description: "Impossible combination"
      },
      {
        id: 3,
        input: JSON.stringify({ coins: [1], amount: 0 }),
        expectedOutput: "0",
        isHidden: false,
        isEdgeCase: false,
        description: "Zero amount"
      },
      {
        id: 4,
        input: JSON.stringify({ coins: [186, 419, 83, 408], amount: 6249 }),
        expectedOutput: "20",
        isHidden: true,
        isEdgeCase: true,
        description: "Large denominations test"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Greedy choice (always picking largest coin) fails for sets like [1, 3, 4] with amount 6 (greedy gives 4+1+1=3, optimal is 3+3=2). Dynamic Programming ensures finding the global optimum."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "An array `dp` of size `amount + 1`, where `dp[i]` stores the min coins needed to make amount `i`."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Initialize `dp` with Infinity, with `dp[0] = 0`. For each `i` from 1 to `amount`, and each `coin` in `coins`: if `i - coin >= 0`, `dp[i] = min(dp[i], dp[i - coin] + 1)`. Return `dp[amount] === Infinity ? -1 : dp[amount]`."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `dp = array of size (amount + 1) filled with INF
dp[0] = 0
for i from 1 to amount:
    for coin in coins:
        if i - coin >= 0:
            dp[i] = min(dp[i], dp[i - coin] + 1)
return dp[amount] if dp[amount] != INF else -1`
      }
    ]
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    topics: ["Arrays", "Depth-First Search", "Breadth-First Search", "Union Find"],
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    inputFormat: "grid: 2D array of character strings '1' and '0'",
    outputFormat: "integer count of islands",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    examples: [
      {
        input: "grid = [ ['1','1','1','1','0'], ['1','1','0','1','0'], ['1','1','0','0','0'], ['0','0','0','0','0'] ]",
        output: "1",
        explanation: "All connected 1s form a single landmass."
      },
      {
        input: "grid = [ ['1','1','0','0','0'], ['1','1','0','0','0'], ['0','0','1','0','0'], ['0','0','0','1','1'] ]",
        output: "3",
        explanation: "Three distinct islands."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    // Write your solution here
    
}`,
      python: `def num_islands(grid: list[list[str]]) -> int:
    # Write your solution here
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your solution here
        return 0;
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({ grid: [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]] }),
        expectedOutput: "1",
        isHidden: false,
        isEdgeCase: false,
        description: "Single large island"
      },
      {
        id: 2,
        input: JSON.stringify({ grid: [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]] }),
        expectedOutput: "3",
        isHidden: false,
        isEdgeCase: false,
        description: "Three separated islands"
      },
      {
        id: 3,
        input: JSON.stringify({ grid: [["0"]] }),
        expectedOutput: "0",
        isHidden: true,
        isEdgeCase: true,
        description: "Only water grid"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "Scan through each cell. When you encounter land ('1'), increment your island count and sink/visit all adjacent connected land."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "Use DFS (recursion) or BFS (queue) to traverse the grid graph."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Iterate across every cell (r, c). When `grid[r][c] === '1'`, run `dfs(r, c)` which marks visited cells as '0' and recursively sinks neighbors (up, down, left, right). Increment count by 1 for each DFS trigger."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `count = 0
def dfs(r, c):
    if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
        return
    grid[r][c] = '0'
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

for r in range(rows):
    for c in range(cols):
        if grid[r][c] == '1':
            count += 1
            dfs(r, c)
return count`
      }
    ]
  },
  {
    title: "LRU Cache",
    slug: "lru-cache",
    difficulty: "Hard",
    topics: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"],
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    inputFormat: "operations: array of method calls, values: arguments",
    outputFormat: "array of return values (null for constructor/put, value for get)",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation: "Cache capacity 2. Key 2 gets evicted when key 3 is added."
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.map = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.map.has(key)) {
        this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
        const oldestKey = this.map.keys().next().value;
        this.map.delete(oldestKey);
    }
    this.map.set(key, value);
};`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = value`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache {
    private int capacity;
    private LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }
    
    public int get(int key) {
        return map.getOrDefault(key, -1);
    }
    
    public void put(int key, int value) {
        map.put(key, value);
    }
}`,
      cpp: `#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> cache;
public:
    LRUCache(int cap) : capacity(cap) {}
    
    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        lru.splice(lru.begin(), lru, cache[key]);
        return cache[key]->second;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            lru.splice(lru.begin(), lru, cache[key]);
            cache[key]->second = value;
            return;
        }
        if (lru.size() == capacity) {
            int oldKey = lru.back().first;
            lru.pop_back();
            cache.erase(oldKey);
        }
        lru.emplace_front(key, value);
        cache[key] = lru.begin();
    }
};`
    },
    testCases: [
      {
        id: 1,
        input: JSON.stringify({
          ops: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
          vals: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        }),
        expectedOutput: JSON.stringify([null, null, null, 1, null, -1, null, -1, 3, 4]),
        isHidden: false,
        isEdgeCase: false,
        description: "Capacity 2 standard sequence"
      },
      {
        id: 2,
        input: JSON.stringify({
          ops: ["LRUCache", "put", "get", "put", "get", "get"],
          vals: [[1], [2, 1], [2], [3, 2], [2], [3]]
        }),
        expectedOutput: JSON.stringify([null, null, 1, null, -1, 2]),
        isHidden: true,
        isEdgeCase: true,
        description: "Capacity 1 eviction test"
      }
    ],
    hints: [
      {
        level: 1,
        title: "Conceptual Direction",
        content: "To achieve O(1) for both get and put, you need fast lookup (hash table) and fast removal/reordering (linked list)."
      },
      {
        level: 2,
        title: "Relevant Data Structure",
        content: "A Doubly Linked List paired with a Hash Map where the map value points directly to the node in the linked list (or JS Map which preserves insertion order)."
      },
      {
        level: 3,
        title: "Algorithmic Approach",
        content: "Whenever a key is accessed or updated, move its node to the front (head) of the doubly linked list. When capacity is exceeded, remove the node at the back (tail) of the list and delete it from the map."
      },
      {
        level: 4,
        title: "Pseudocode",
        content: `get(key):
    if key not in map: return -1
    node = map[key]
    moveToHead(node)
    return node.value

put(key, value):
    if key in map:
        node = map[key]
        node.value = value
        moveToHead(node)
    else:
        if size >= capacity:
            tailNode = removeTail()
            delete map[tailNode.key]
        newNode = createNode(key, value)
        addToHead(newNode)
        map[key] = newNode`
      }
    ]
  }
];

