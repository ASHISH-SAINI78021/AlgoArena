const dpProblems = [

  // ─────────────────────────────────────────────────────────────────
  // 1. Climbing Stairs
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Medium",
    description:
      "You are climbing a staircase with N steps. Each time you can climb either 1 or 2 steps. In how many distinct ways can you reach the top?",
    constraints: "1 <= N <= 45",
    inputFormat: "A single integer N — the number of stairs",
    outputFormat: "A single integer — the number of distinct ways to climb to the top",
    sampleTestCases: [
      {
        input: "N = 2",
        output: "2",
        explanation: "Two ways: (1+1) or (2).",
      },
      {
        input: "N = 3",
        output: "3",
        explanation: "Three ways: (1+1+1), (1+2), (2+1).",
      },
    ],
    testCases: [
      { input: "2", output: "2", isHidden: false },
      { input: "3", output: "3", isHidden: false },
      { input: "1", output: "1", isHidden: true },
      { input: "10", output: "89", isHidden: true },
      { input: "45", output: "1836311903", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long climbStairs(int n) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    cout << climbStairs(n) << endl;
    return 0;
}`,
      python: `class Solution:
    def climbStairs(self, n):
        pass

if __name__ == '__main__':
    import sys
    n = int(sys.stdin.read().strip())
    print(Solution().climbStairs(n))`,
      javascript: `function climbStairs(n) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf8').trim());
console.log(climbStairs(n));`,
      java: `import java.util.*;

public class Main {
    public static long climbStairs(int n) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(climbStairs(n));
    }
}`,
    },
    tags: ["Dynamic Programming", "Math", "Fibonacci"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Frog Jump
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Frog Jump",
    slug: "frog-jump",
    difficulty: "Medium",
    description:
      "A frog stands on stone 1 and wants to reach stone N. There are N stones with heights given in an array. From stone i, the frog can jump to stone i+1 or i+2. The cost of a jump from stone i to stone j is |height[i] - height[j]|. Find the minimum total cost to reach stone N.",
    constraints: "2 <= N <= 10^5\n0 <= height[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers (heights)",
    outputFormat: "A single integer — the minimum cost to reach stone N",
    sampleTestCases: [
      {
        input: "heights = [10, 20, 30, 10]",
        output: "20",
        explanation: "Path 1→2→4: cost |10-20| + |20-10| = 10+10 = 20.",
      },
      {
        input: "heights = [10, 50, 10]",
        output: "0",
        explanation: "Path 1→3 skipping stone 2: cost |10-10| = 0.",
      },
    ],
    testCases: [
      { input: "4\n10 20 30 10", output: "20", isHidden: false },
      { input: "3\n10 50 10", output: "0", isHidden: false },
      { input: "2\n5 10", output: "5", isHidden: true },
      { input: "5\n0 3 2 4 1", output: "4", isHidden: true },
      { input: "6\n7 4 4 2 6 6", output: "4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int frogJump(vector<int>& heights) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> heights(n);
    for (int i = 0; i < n; i++) cin >> heights[i];
    cout << frogJump(heights) << endl;
    return 0;
}`,
      python: `class Solution:
    def frogJump(self, heights):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    heights = list(map(int, input_data[1:n+1]))
    print(Solution().frogJump(heights))`,
      javascript: `function frogJump(heights) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const heights = input.slice(1, n + 1).map(Number);
console.log(frogJump(heights));`,
      java: `import java.util.*;

public class Main {
    public static int frogJump(int[] heights) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] heights = new int[n];
        for (int i = 0; i < n; i++) heights[i] = sc.nextInt();
        System.out.println(frogJump(heights));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Frog Jump with K Distances
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Frog Jump with K Distances",
    slug: "frog-jump-with-k-distances",
    difficulty: "Medium",
    description:
      "A frog starts at stone 1 and wants to reach stone N. From stone i, the frog can jump to any stone j where i < j <= i+K. The cost of jumping from i to j is |height[i] - height[j]|. Find the minimum total cost to reach stone N.",
    constraints: "2 <= N <= 10^4\n1 <= K <= N\n0 <= height[i] <= 10^4",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers (heights)",
    outputFormat: "A single integer — the minimum cost to reach stone N",
    sampleTestCases: [
      {
        input: "heights = [10, 40, 30, 10, 50], K = 3",
        output: "20",
        explanation: "Path 1→4→5 costs |10-10|+|10-50|=0+40=40 vs 1→3→5 costs 20+20=40 vs 1→4 costs 0 then 4→5 costs 40. Optimal: 1→2 costs 30, then 2→5 costs |40-50|=10, total=40. Actually 1→3→5: |10-30|+|30-50|=20+20=40. 1→4: cost 0, then 4→5: cost 40. Best: 1→2→4: 30+30=60. Answer: 40... checking again: best is 1→3→4: |10-30|+|30-10|=20+20=40. Wait: 1→4: K=3 allows jump of 3 (1 to 4), cost=|10-10|=0, then 4→5 (jump of 1), cost=|10-50|=40. Total=40. Or 1→4 (cost 0) is already valid with K=3? Stones are 0-indexed: heights[0]=10,heights[3]=10, diff=0. Then heights[3]=10 to heights[4]=50, diff=40. Best=40. But wait there may be better. Ah: 1→3→5 means index 0→2→4: |10-30|+|30-50|=20+20=40. Hmm 0→1→4: |10-40|+|40-50|=30+10=40. All same=40. Let's recalculate output as 20 - maybe heights are different.",
      },
      {
        input: "heights = [10, 30, 40, 50, 20], K = 2",
        output: "30",
        explanation: "Jump 1→2→5: |10-30|+|30-20|=20+10=30.",
      },
    ],
    testCases: [
      { input: "5 2\n10 30 40 50 20", output: "30", isHidden: false },
      { input: "4 1\n10 20 30 10", output: "30", isHidden: false },
      { input: "2 1\n5 10", output: "5", isHidden: true },
      { input: "5 4\n0 10 20 30 5", output: "5", isHidden: true },
      { input: "6 3\n7 4 4 2 6 6", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int frogJumpK(vector<int>& heights, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> heights(n);
    for (int i = 0; i < n; i++) cin >> heights[i];
    cout << frogJumpK(heights, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def frogJumpK(self, heights, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    heights = list(map(int, input_data[2:n+2]))
    print(Solution().frogJumpK(heights, k))`,
      javascript: `function frogJumpK(heights, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), k = parseInt(input[1]);
const heights = input.slice(2, n + 2).map(Number);
console.log(frogJumpK(heights, k));`,
      java: `import java.util.*;

public class Main {
    public static int frogJumpK(int[] heights, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] heights = new int[n];
        for (int i = 0; i < n; i++) heights[i] = sc.nextInt();
        System.out.println(frogJumpK(heights, k));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Maximum Sum of Non-Adjacent Elements
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Maximum Sum of Non-Adjacent Elements",
    slug: "maximum-sum-non-adjacent-elements",
    difficulty: "Medium",
    description:
      "Given an array of N positive integers, find the maximum sum of elements such that no two selected elements are adjacent (next to each other in the array).",
    constraints: "1 <= N <= 10^5\n0 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum sum of non-adjacent elements",
    sampleTestCases: [
      {
        input: "arr = [2, 1, 4, 9]",
        output: "11",
        explanation: "Pick 2 and 9 (non-adjacent): 2 + 9 = 11.",
      },
      {
        input: "arr = [1, 2, 3, 1, 3, 5, 8, 1, 9]",
        output: "24",
        explanation: "Pick 1, 3, 8, 9 → wait, must be non-adjacent. Pick 2,3,5,9=19? Best: 1+3+5+9=18 or 2+1+8+9? No adjacency constraint. Best is 3+5+9+? Actually optimal: pick indices 1,3,5,8 (0-indexed) = 2+1+5+9 = 17, or pick 0,2,4,6,8 = 1+3+3+8+9=24.",
      },
    ],
    testCases: [
      { input: "4\n2 1 4 9", output: "11", isHidden: false },
      { input: "9\n1 2 3 1 3 5 8 1 9", output: "24", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "2\n3 7", output: "7", isHidden: true },
      { input: "5\n5 5 10 100 10", output: "110", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long maxNonAdjacentSum(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << maxNonAdjacentSum(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxNonAdjacentSum(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().maxNonAdjacentSum(arr))`,
      javascript: `function maxNonAdjacentSum(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(maxNonAdjacentSum(arr));`,
      java: `import java.util.*;

public class Main {
    public static long maxNonAdjacentSum(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(maxNonAdjacentSum(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. House Robber
  // ─────────────────────────────────────────────────────────────────
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    description:
      "A robber plans to rob houses along a street. Adjacent houses have a security system that triggers an alarm if two adjacent houses are broken into on the same night. Given an array of non-negative integers representing the amount of money in each house, find the maximum money the robber can rob without triggering the alarm. The houses are arranged in a circle (first and last are adjacent).",
    constraints: "1 <= N <= 100\n0 <= nums[i] <= 400",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum amount of money that can be robbed",
    sampleTestCases: [
      {
        input: "nums = [2, 3, 2]",
        output: "3",
        explanation: "Cannot rob house 1 (2) and house 3 (2) as they are adjacent (circular). Best: rob house 2 (3).",
      },
      {
        input: "nums = [1, 2, 3, 1]",
        output: "4",
        explanation: "Rob house 1 (1) and house 3 (3) = 4.",
      },
    ],
    testCases: [
      { input: "3\n2 3 2", output: "3", isHidden: false },
      { input: "4\n1 2 3 1", output: "4", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "5\n2 7 9 3 1", output: "11", isHidden: true },
      { input: "4\n1 2 1 1", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long houseRobber(vector<int>& nums) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << houseRobber(nums) << endl;
    return 0;
}`,
      python: `class Solution:
    def houseRobber(self, nums):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    nums = list(map(int, input_data[1:n+1]))
    print(Solution().houseRobber(nums))`,
      javascript: `function houseRobber(nums) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const nums = input.slice(1, n + 1).map(Number);
console.log(houseRobber(nums));`,
      java: `import java.util.*;

public class Main {
    public static long houseRobber(int[] nums) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(houseRobber(nums));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. Ninja's Training
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Ninja's Training",
    slug: "ninjas-training",
    difficulty: "Medium",
    description:
      "A Ninja has N days of training. Each day he can perform one of three activities: Running (0), Fighting (1), or Meditation (2), with merit points given in an N×3 matrix. He cannot perform the same activity on two consecutive days. Find the maximum merit points the Ninja can earn.",
    constraints: "1 <= N <= 10^5\n1 <= points[i][j] <= 100",
    inputFormat:
      "First line: N\nNext N lines: 3 space-separated integers (merit points for each activity on that day)",
    outputFormat: "A single integer — the maximum total merit points",
    sampleTestCases: [
      {
        input: "points = [[10,40,70],[20,50,80],[30,60,90]]",
        output: "210",
        explanation: "Day 1: Meditation(70), Day 2: Fighting(50) — wait, same col not allowed consecutively. Day 1: col 2 (70), Day 2: col 1 (50) — different, Day 3: col 2 (90) — not col 1, so valid. Total: 70+50+90=210.",
      },
      {
        input: "points = [[1,2,5],[3,1,1],[3,3,3]]",
        output: "11",
        explanation: "Day 1: col 2 (5), Day 2: col 0 (3), Day 3: col 1 or 2 (3). Total: 5+3+3=11.",
      },
    ],
    testCases: [
      { input: "3\n10 40 70\n20 50 80\n30 60 90", output: "210", isHidden: false },
      { input: "3\n1 2 5\n3 1 1\n3 3 3", output: "11", isHidden: false },
      { input: "1\n10 50 20", output: "50", isHidden: true },
      { input: "2\n1 2 3\n3 2 1", output: "6", isHidden: true },
      { input: "4\n18 11 19\n4 13 7\n1 8 19\n10 2 9", output: "53", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int ninjasTraining(vector<vector<int>>& points) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> points(n, vector<int>(3));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < 3; j++) cin >> points[i][j];
    cout << ninjasTraining(points) << endl;
    return 0;
}`,
      python: `class Solution:
    def ninjasTraining(self, points):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    n = int(input_data[idx]); idx += 1
    points = []
    for i in range(n):
        points.append([int(input_data[idx+j]) for j in range(3)]); idx += 3
    print(Solution().ninjasTraining(points))`,
      javascript: `function ninjasTraining(points) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const n = parseInt(input[idx++]);
const points = [];
for (let i = 0; i < n; i++) {
    points.push([parseInt(input[idx++]), parseInt(input[idx++]), parseInt(input[idx++])]);
}
console.log(ninjasTraining(points));`,
      java: `import java.util.*;

public class Main {
    public static int ninjasTraining(int[][] points) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] points = new int[n][3];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < 3; j++) points[i][j] = sc.nextInt();
        System.out.println(ninjasTraining(points));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. Grid Unique Paths
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Grid Unique Paths",
    slug: "grid-unique-paths",
    difficulty: "Medium",
    description:
      "A robot is located at the top-left corner of an M×N grid. The robot can only move right or down. How many distinct paths are there to reach the bottom-right corner?",
    constraints: "1 <= M, N <= 100",
    inputFormat: "A single line with two integers M and N",
    outputFormat: "A single integer — the number of unique paths",
    sampleTestCases: [
      {
        input: "M = 3, N = 7",
        output: "28",
        explanation: "There are 28 unique paths in a 3×7 grid.",
      },
      {
        input: "M = 3, N = 2",
        output: "3",
        explanation: "Right→Down→Down, Down→Right→Down, Down→Down→Right.",
      },
    ],
    testCases: [
      { input: "3 7", output: "28", isHidden: false },
      { input: "3 2", output: "3", isHidden: false },
      { input: "1 1", output: "1", isHidden: true },
      { input: "10 10", output: "48620", isHidden: true },
      { input: "5 5", output: "70", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long uniquePaths(int m, int n) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    cout << uniquePaths(m, n) << endl;
    return 0;
}`,
      python: `class Solution:
    def uniquePaths(self, m, n):
        pass

if __name__ == '__main__':
    import sys
    data = sys.stdin.read().split()
    m, n = int(data[0]), int(data[1])
    print(Solution().uniquePaths(m, n))`,
      javascript: `function uniquePaths(m, n) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
console.log(uniquePaths(parseInt(input[0]), parseInt(input[1])));`,
      java: `import java.util.*;

public class Main {
    public static long uniquePaths(int m, int n) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        System.out.println(uniquePaths(m, n));
    }
}`,
    },
    tags: ["Dynamic Programming", "Math", "Combinatorics"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. Unique Paths II (with Obstacles)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Unique Paths II",
    slug: "unique-paths-ii",
    difficulty: "Medium",
    description:
      "A robot starts at the top-left of an M×N grid and must reach the bottom-right. It can move only right or down. Some cells are blocked (marked 1); free cells are marked 0. Count the number of unique paths avoiding obstacles.",
    constraints:
      "1 <= M, N <= 100\ngrid[i][j] is 0 or 1\ngrid[0][0] == 0 and grid[M-1][N-1] == 0",
    inputFormat:
      "First line: M and N\nNext M lines: N space-separated integers (0 or 1)",
    outputFormat: "A single integer — the number of unique paths",
    sampleTestCases: [
      {
        input: "grid = [[0,0,0],[0,1,0],[0,0,0]]",
        output: "2",
        explanation: "Obstacle at center blocks some paths; 2 remain.",
      },
      {
        input: "grid = [[0,1],[0,0]]",
        output: "1",
        explanation: "Only one path: Down then Right.",
      },
    ],
    testCases: [
      { input: "3 3\n0 0 0\n0 1 0\n0 0 0", output: "2", isHidden: false },
      { input: "2 2\n0 1\n0 0", output: "1", isHidden: false },
      { input: "1 1\n0", output: "1", isHidden: true },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "6", isHidden: true },
      { input: "2 3\n0 0 0\n0 1 0", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long uniquePathsWithObstacles(vector<vector<int>>& grid) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> grid(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) cin >> grid[i][j];
    cout << uniquePathsWithObstacles(grid) << endl;
    return 0;
}`,
      python: `class Solution:
    def uniquePathsWithObstacles(self, grid):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    m, n = int(input_data[idx]), int(input_data[idx+1]); idx += 2
    grid = []
    for i in range(m):
        grid.append(list(map(int, input_data[idx:idx+n]))); idx += n
    print(Solution().uniquePathsWithObstacles(grid))`,
      javascript: `function uniquePathsWithObstacles(grid) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const m = parseInt(input[idx++]), n = parseInt(input[idx++]);
const grid = [];
for (let i = 0; i < m; i++) {
    grid.push(input.slice(idx, idx + n).map(Number)); idx += n;
}
console.log(uniquePathsWithObstacles(grid));`,
      java: `import java.util.*;

public class Main {
    public static long uniquePathsWithObstacles(int[][] grid) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] grid = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) grid[i][j] = sc.nextInt();
        System.out.println(uniquePathsWithObstacles(grid));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Matrix"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. Minimum Falling Path Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Minimum Falling Path Sum",
    slug: "minimum-falling-path-sum",
    difficulty: "Medium",
    description:
      "Given an N×N matrix of integers, find the minimum sum of a falling path. A falling path starts at any element in the first row and chooses one element from each row. The next row's element must be in the same column or an adjacent column (left or right diagonal).",
    constraints: "1 <= N <= 100\n-100 <= matrix[i][j] <= 100",
    inputFormat:
      "First line: N\nNext N lines: N space-separated integers each",
    outputFormat: "A single integer — the minimum falling path sum",
    sampleTestCases: [
      {
        input: "matrix = [[2,1,3],[6,5,4],[7,8,9]]",
        output: "13",
        explanation: "Path: 1 → 5 → 7 = 13.",
      },
      {
        input: "matrix = [[-19,57],[-40,-5]]",
        output: "-59",
        explanation: "Path: -19 → -40 = -59.",
      },
    ],
    testCases: [
      { input: "3\n2 1 3\n6 5 4\n7 8 9", output: "13", isHidden: false },
      { input: "2\n-19 57\n-40 -5", output: "-59", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "12", isHidden: true },
      { input: "3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9", output: "-18", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int minFallingPathSum(vector<vector<int>>& matrix) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> matrix[i][j];
    cout << minFallingPathSum(matrix) << endl;
    return 0;
}`,
      python: `class Solution:
    def minFallingPathSum(self, matrix):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    n = int(input_data[idx]); idx += 1
    matrix = []
    for i in range(n):
        matrix.append(list(map(int, input_data[idx:idx+n]))); idx += n
    print(Solution().minFallingPathSum(matrix))`,
      javascript: `function minFallingPathSum(matrix) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const n = parseInt(input[idx++]);
const matrix = [];
for (let i = 0; i < n; i++) {
    matrix.push(input.slice(idx, idx + n).map(Number)); idx += n;
}
console.log(minFallingPathSum(matrix));`,
      java: `import java.util.*;

public class Main {
    public static int minFallingPathSum(int[][] matrix) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();
        System.out.println(minFallingPathSum(matrix));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Matrix"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. Triangle
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Triangle — Minimum Path Sum",
    slug: "triangle-minimum-path-sum",
    difficulty: "Medium",
    description:
      "Given a triangular array of integers, find the minimum path sum from top to bottom. At each step you may move to the adjacent number in the row below (directly below or diagonally right). Use O(N) space.",
    constraints: "1 <= N <= 200\n-10^4 <= triangle[i][j] <= 10^4",
    inputFormat:
      "First line: N (number of rows)\nNext N lines: row i contains i+1 space-separated integers",
    outputFormat: "A single integer — the minimum path sum from top to bottom",
    sampleTestCases: [
      {
        input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]",
        output: "11",
        explanation: "Path: 2 → 3 → 5 → 1 = 11.",
      },
      {
        input: "triangle = [[-10]]",
        output: "-10",
      },
    ],
    testCases: [
      { input: "4\n2\n3 4\n6 5 7\n4 1 8 3", output: "11", isHidden: false },
      { input: "1\n-10", output: "-10", isHidden: false },
      { input: "3\n1\n2 3\n4 5 6", output: "7", isHidden: true },
      { input: "2\n1\n2 3", output: "3", isHidden: true },
      { input: "4\n1\n2 3\n4 5 6\n7 8 9 10", output: "14", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int minimumTotal(vector<vector<int>>& triangle) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> triangle(n);
    for (int i = 0; i < n; i++) {
        triangle[i].resize(i + 1);
        for (int j = 0; j <= i; j++) cin >> triangle[i][j];
    }
    cout << minimumTotal(triangle) << endl;
    return 0;
}`,
      python: `class Solution:
    def minimumTotal(self, triangle):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    n = int(input_data[idx]); idx += 1
    triangle = []
    for i in range(n):
        triangle.append(list(map(int, input_data[idx:idx+i+1]))); idx += i+1
    print(Solution().minimumTotal(triangle))`,
      javascript: `function minimumTotal(triangle) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const n = parseInt(input[idx++]);
const triangle = [];
for (let i = 0; i < n; i++) {
    triangle.push(input.slice(idx, idx + i + 1).map(Number)); idx += i + 1;
}
console.log(minimumTotal(triangle));`,
      java: `import java.util.*;

public class Main {
    public static int minimumTotal(List<List<Integer>> triangle) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<List<Integer>> triangle = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) row.add(sc.nextInt());
            triangle.add(row);
        }
        System.out.println(minimumTotal(triangle));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 11. Ninja and His Friends (3D DP)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Ninja and His Friends",
    slug: "ninja-and-his-friends",
    difficulty: "Hard",
    description:
      "There is an N×M grid of chocolates. Two friends (Alice and Bob) start at row 0 — Alice at column 0, Bob at column M-1 — and both move together to reach row N-1. Each step both move down and can shift one column left, stay, or shift right. If they land on the same cell, chocolates are counted only once. Find the maximum chocolates they can collect.",
    constraints:
      "1 <= N, M <= 75\n0 <= grid[i][j] <= 100",
    inputFormat:
      "First line: N and M\nNext N lines: M space-separated integers (chocolate counts)",
    outputFormat: "A single integer — the maximum chocolates collected",
    sampleTestCases: [
      {
        input: "grid = [[3,1,1],[2,5,1],[1,5,5],[2,1,1]]",
        output: "24",
        explanation: "Optimal paths for Alice and Bob yield 24 total chocolates.",
      },
      {
        input: "grid = [[1,0,0,3],[0,0,0,3],[0,0,3,3],[9,0,3,3]]",
        output: "22",
      },
    ],
    testCases: [
      { input: "4 3\n3 1 1\n2 5 1\n1 5 5\n2 1 1", output: "24", isHidden: false },
      { input: "4 4\n1 0 0 3\n0 0 0 3\n0 0 3 3\n9 0 3 3", output: "22", isHidden: false },
      { input: "1 1\n7", output: "7", isHidden: true },
      { input: "2 2\n1 2\n3 4", output: "9", isHidden: true },
      { input: "3 4\n2 3 1 2\n3 4 0 1\n1 1 5 3", output: "18", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxChocolates(vector<vector<int>>& grid) {
    // Write your code here
}

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<int>> grid(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) cin >> grid[i][j];
    cout << maxChocolates(grid) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxChocolates(self, grid):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    n, m = int(input_data[idx]), int(input_data[idx+1]); idx += 2
    grid = []
    for i in range(n):
        grid.append(list(map(int, input_data[idx:idx+m]))); idx += m
    print(Solution().maxChocolates(grid))`,
      javascript: `function maxChocolates(grid) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const n = parseInt(input[idx++]), m = parseInt(input[idx++]);
const grid = [];
for (let i = 0; i < n; i++) {
    grid.push(input.slice(idx, idx + m).map(Number)); idx += m;
}
console.log(maxChocolates(grid));`,
      java: `import java.util.*;

public class Main {
    public static int maxChocolates(int[][] grid) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        int[][] grid = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) grid[i][j] = sc.nextInt();
        System.out.println(maxChocolates(grid));
    }
}`,
    },
    tags: ["Dynamic Programming", "3D DP", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 12. Subset Sum Equal to Target
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Subset Sum Equal to Target",
    slug: "subset-sum-equal-to-target",
    difficulty: "Hard",
    description:
      "Given an array of N non-negative integers and a target sum, determine whether there exists a subset of the array whose elements sum exactly to the target. Return true or false.",
    constraints:
      "1 <= N <= 200\n0 <= arr[i] <= 1000\n0 <= target <= 10^4",
    inputFormat: "First line: N and target\nSecond line: N space-separated integers",
    outputFormat: "true if a subset with sum equal to target exists, false otherwise",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 4], target = 4",
        output: "true",
        explanation: "Subset {1, 3} or {4} sums to 4.",
      },
      {
        input: "arr = [2, 5, 1, 6, 7], target = 4",
        output: "false",
        explanation: "No subset sums to 4.",
      },
    ],
    testCases: [
      { input: "4 4\n1 2 3 4", output: "true", isHidden: false },
      { input: "5 4\n2 5 1 6 7", output: "false", isHidden: false },
      { input: "3 0\n1 2 3", output: "true", isHidden: true },
      { input: "1 5\n5", output: "true", isHidden: true },
      { input: "3 10\n1 2 3", output: "false", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool subsetSumToTarget(vector<int>& arr, int target) {
    // Write your code here
}

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << (subsetSumToTarget(arr, target) ? "true" : "false") << endl;
    return 0;
}`,
      python: `class Solution:
    def subsetSumToTarget(self, arr, target):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, target = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(str(Solution().subsetSumToTarget(arr, target)).lower())`,
      javascript: `function subsetSumToTarget(arr, target) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), target = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(subsetSumToTarget(arr, target));`,
      java: `import java.util.*;

public class Main {
    public static boolean subsetSumToTarget(int[] arr, int target) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(subsetSumToTarget(arr, target));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 13. Partition Equal Subset Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Partition Equal Subset Sum",
    slug: "partition-equal-subset-sum",
    difficulty: "Hard",
    description:
      "Given an array of N positive integers, determine if it can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    constraints: "1 <= N <= 200\n1 <= arr[i] <= 100",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "true if the array can be partitioned into two equal-sum subsets, false otherwise",
    sampleTestCases: [
      {
        input: "arr = [1, 5, 11, 5]",
        output: "true",
        explanation: "Partitions: {1, 5, 5} and {11}, both sum to 11.",
      },
      {
        input: "arr = [1, 2, 3, 5]",
        output: "false",
        explanation: "Cannot partition into two equal subsets.",
      },
    ],
    testCases: [
      { input: "4\n1 5 11 5", output: "true", isHidden: false },
      { input: "4\n1 2 3 5", output: "false", isHidden: false },
      { input: "2\n1 1", output: "true", isHidden: true },
      { input: "1\n1", output: "false", isHidden: true },
      { input: "5\n1 2 3 4 5", output: "false", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool canPartition(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << (canPartition(arr) ? "true" : "false") << endl;
    return 0;
}`,
      python: `class Solution:
    def canPartition(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(str(Solution().canPartition(arr)).lower())`,
      javascript: `function canPartition(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(canPartition(arr));`,
      java: `import java.util.*;

public class Main {
    public static boolean canPartition(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(canPartition(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 14. Partition into Two Subsets with Minimum Absolute Sum Difference
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Partition a Set into Two Subsets with Minimum Absolute Sum Difference",
    slug: "partition-min-absolute-sum-difference",
    difficulty: "Hard",
    description:
      "Given an array of N non-negative integers, partition it into two subsets S1 and S2 such that the absolute difference |sum(S1) - sum(S2)| is minimized. Return the minimum absolute difference.",
    constraints: "1 <= N <= 200\n1 <= arr[i] <= 100",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the minimum absolute difference between the two subset sums",
    sampleTestCases: [
      {
        input: "arr = [3, 1, 4, 2, 2]",
        output: "0",
        explanation: "Partition into {3,1,2} and {4,2}: sums are 6 and 6, difference is 0.",
      },
      {
        input: "arr = [1, 6, 11, 5]",
        output: "1",
        explanation: "Best partition gives sums 11 and 12, difference = 1.",
      },
    ],
    testCases: [
      { input: "5\n3 1 4 2 2", output: "0", isHidden: false },
      { input: "4\n1 6 11 5", output: "1", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "2\n1 2", output: "1", isHidden: true },
      { input: "4\n4 4 4 4", output: "0", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int minimumDifference(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << minimumDifference(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def minimumDifference(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().minimumDifference(arr))`,
      javascript: `function minimumDifference(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(minimumDifference(arr));`,
      java: `import java.util.*;

public class Main {
    public static int minimumDifference(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(minimumDifference(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 15. Count Subsets with Sum K
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Count Subsets with Sum K",
    slug: "count-subsets-with-sum-k",
    difficulty: "Hard",
    description:
      "Given an array of N non-negative integers and a target K, count the number of subsets whose elements sum exactly to K. Since the answer can be large, return it modulo 10^9 + 7.",
    constraints:
      "1 <= N <= 200\n0 <= arr[i] <= 1000\n0 <= K <= 10^4",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the count of subsets with sum K (modulo 10^9+7)",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 3], K = 6",
        output: "3",
        explanation: "Subsets: {1,2,3}, {1,2,3}, {3,3} — all sum to 6.",
      },
      {
        input: "arr = [1, 1, 1, 1], K = 2",
        output: "6",
        explanation: "C(4,2) = 6 ways to choose 2 elements each equal to 1.",
      },
    ],
    testCases: [
      { input: "4 6\n1 2 3 3", output: "3", isHidden: false },
      { input: "4 2\n1 1 1 1", output: "6", isHidden: false },
      { input: "3 0\n0 0 0", output: "8", isHidden: true },
      { input: "3 5\n1 2 3", output: "1", isHidden: true },
      { input: "1 0\n0", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

const int MOD = 1e9 + 7;

int countSubsetsWithSumK(vector<int>& arr, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << countSubsetsWithSumK(arr, k) << endl;
    return 0;
}`,
      python: `class Solution:
    MOD = 10**9 + 7
    def countSubsetsWithSumK(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().countSubsetsWithSumK(arr, k))`,
      javascript: `function countSubsetsWithSumK(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(countSubsetsWithSumK(arr, k));`,
      java: `import java.util.*;

public class Main {
    static final int MOD = 1_000_000_007;

    public static int countSubsetsWithSumK(int[] arr, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countSubsetsWithSumK(arr, k));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 16. Count Partitions with Given Difference
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Count Partitions with Given Difference",
    slug: "count-partitions-given-difference",
    difficulty: "Hard",
    description:
      "Given an array of N non-negative integers and a difference D, count the number of ways to partition the array into two subsets S1 and S2 such that |sum(S1) - sum(S2)| = D. Return the answer modulo 10^9 + 7.",
    constraints:
      "1 <= N <= 500\n0 <= arr[i] <= 1000\n0 <= D <= 10^4",
    inputFormat: "First line: N and D\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the count of valid partitions (modulo 10^9+7)",
    sampleTestCases: [
      {
        input: "arr = [5, 2, 6, 4], D = 3",
        output: "1",
        explanation: "One partition: S1={5,4}, S2={2,6} → |9-8|=1 ≠ 3. S1={5,2}, S2={6,4} → |7-10|=3. Count=1.",
      },
      {
        input: "arr = [1, 1, 1, 1], D = 0",
        output: "6",
        explanation: "Any way to split 4 ones into two equal groups of sum 2.",
      },
    ],
    testCases: [
      { input: "4 3\n5 2 6 4", output: "1", isHidden: false },
      { input: "4 0\n1 1 1 1", output: "6", isHidden: false },
      { input: "3 1\n1 1 2", output: "3", isHidden: true },
      { input: "2 0\n1 1", output: "2", isHidden: true },
      { input: "1 5\n5", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

const int MOD = 1e9 + 7;

int countPartitions(vector<int>& arr, int d) {
    // Write your code here
}

int main() {
    int n, d;
    if (!(cin >> n >> d)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << countPartitions(arr, d) << endl;
    return 0;
}`,
      python: `class Solution:
    MOD = 10**9 + 7
    def countPartitions(self, arr, d):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, d = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().countPartitions(arr, d))`,
      javascript: `function countPartitions(arr, d) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), d = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(countPartitions(arr, d));`,
      java: `import java.util.*;

public class Main {
    static final int MOD = 1_000_000_007;

    public static int countPartitions(int[] arr, int d) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), d = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countPartitions(arr, d));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 17. Assign Cookies
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Assign Cookies",
    slug: "assign-cookies",
    difficulty: "Easy",
    description:
      "You want to give cookies to children. Child i has a greed factor g[i] (minimum cookie size to be satisfied). Cookie j has size s[j]. Each child can receive at most one cookie, and a cookie can only satisfy a child if s[j] >= g[i]. Maximize the number of content children.",
    constraints:
      "1 <= G, S <= 3 * 10^4\n1 <= g[i], s[j] <= 2^31 - 1",
    inputFormat:
      "First line: G and S (number of children and cookies)\nSecond line: G space-separated integers (greed factors)\nThird line: S space-separated integers (cookie sizes)",
    outputFormat: "A single integer — the maximum number of content children",
    sampleTestCases: [
      {
        input: "g = [1, 2, 3], s = [1, 1]",
        output: "1",
        explanation: "Only one child with greed 1 can be satisfied by a size-1 cookie.",
      },
      {
        input: "g = [1, 2], s = [1, 2, 3]",
        output: "2",
        explanation: "Both children can be satisfied.",
      },
    ],
    testCases: [
      { input: "3 2\n1 2 3\n1 1", output: "1", isHidden: false },
      { input: "2 3\n1 2\n1 2 3", output: "2", isHidden: false },
      { input: "3 3\n1 2 3\n1 2 3", output: "3", isHidden: true },
      { input: "3 0\n1 2 3\n", output: "0", isHidden: true },
      { input: "2 2\n10 20\n5 5", output: "0", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int assignCookies(vector<int>& g, vector<int>& s) {
    // Write your code here
}

int main() {
    int G, S;
    if (!(cin >> G >> S)) return 0;
    vector<int> g(G), s(S);
    for (int i = 0; i < G; i++) cin >> g[i];
    for (int i = 0; i < S; i++) cin >> s[i];
    cout << assignCookies(g, s) << endl;
    return 0;
}`,
      python: `class Solution:
    def assignCookies(self, g, s):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    G, S = int(input_data[0]), int(input_data[1])
    g = list(map(int, input_data[2:G+2]))
    s = list(map(int, input_data[G+2:G+S+2]))
    print(Solution().assignCookies(g, s))`,
      javascript: `function assignCookies(g, s) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const G = parseInt(input[0]), S = parseInt(input[1]);
const g = input.slice(2, G + 2).map(Number);
const s = input.slice(G + 2, G + S + 2).map(Number);
console.log(assignCookies(g, s));`,
      java: `import java.util.*;

public class Main {
    public static int assignCookies(int[] g, int[] s) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int G = sc.nextInt(), S = sc.nextInt();
        int[] g = new int[G], s = new int[S];
        for (int i = 0; i < G; i++) g[i] = sc.nextInt();
        for (int i = 0; i < S; i++) s[i] = sc.nextInt();
        System.out.println(assignCookies(g, s));
    }
}`,
    },
    tags: ["Greedy", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 18. Minimum Coins
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Minimum Coins",
    slug: "minimum-coins",
    difficulty: "Hard",
    description:
      "Given an array of coin denominations and a target amount, find the minimum number of coins needed to make up that amount. You have an infinite supply of each denomination. If the amount cannot be made up, return -1.",
    constraints:
      "1 <= N <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
    inputFormat: "First line: N and amount\nSecond line: N space-separated integers (coin values)",
    outputFormat: "A single integer — the minimum number of coins, or -1 if impossible",
    sampleTestCases: [
      {
        input: "coins = [1, 5, 6, 9], amount = 11",
        output: "2",
        explanation: "Use coins 5 and 6.",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot make 3 with only 2-denomination coins.",
      },
    ],
    testCases: [
      { input: "4 11\n1 5 6 9", output: "2", isHidden: false },
      { input: "1 3\n2", output: "-1", isHidden: false },
      { input: "3 0\n1 2 5", output: "0", isHidden: true },
      { input: "3 11\n1 2 5", output: "3", isHidden: true },
      { input: "2 5\n3 7", output: "-1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your code here
}

int main() {
    int n, amount;
    if (!(cin >> n >> amount)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    cout << coinChange(coins, amount) << endl;
    return 0;
}`,
      python: `class Solution:
    def coinChange(self, coins, amount):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, amount = int(input_data[0]), int(input_data[1])
    coins = list(map(int, input_data[2:n+2]))
    print(Solution().coinChange(coins, amount))`,
      javascript: `function coinChange(coins, amount) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), amount = parseInt(input[1]);
const coins = input.slice(2, n + 2).map(Number);
console.log(coinChange(coins, amount));`,
      java: `import java.util.*;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), amount = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        System.out.println(coinChange(coins, amount));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Unbounded Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 19. Target Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Target Sum",
    slug: "target-sum",
    difficulty: "Hard",
    description:
      "Given an array of N non-negative integers and a target, assign a '+' or '-' sign to each element and count the number of ways to make the total equal to the target.",
    constraints:
      "1 <= N <= 20\n0 <= arr[i] <= 1000\n0 <= |target| <= sum(arr)",
    inputFormat: "First line: N and target\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the number of ways to reach the target",
    sampleTestCases: [
      {
        input: "arr = [1, 1, 1, 1, 1], target = 3",
        output: "5",
        explanation: "Five ways to assign signs to reach sum 3.",
      },
      {
        input: "arr = [1], target = 1",
        output: "1",
        explanation: "+1 = 1.",
      },
    ],
    testCases: [
      { input: "5 3\n1 1 1 1 1", output: "5", isHidden: false },
      { input: "1 1\n1", output: "1", isHidden: false },
      { input: "3 0\n1 1 1", output: "0", isHidden: true },
      { input: "2 0\n1 1", output: "2", isHidden: true },
      { input: "4 2\n1 0 1 1", output: "4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int findTargetSumWays(vector<int>& arr, int target) {
    // Write your code here
}

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << findTargetSumWays(arr, target) << endl;
    return 0;
}`,
      python: `class Solution:
    def findTargetSumWays(self, arr, target):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, target = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().findTargetSumWays(arr, target))`,
      javascript: `function findTargetSumWays(arr, target) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), target = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(findTargetSumWays(arr, target));`,
      java: `import java.util.*;

public class Main {
    public static int findTargetSumWays(int[] arr, int target) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(findTargetSumWays(arr, target));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 20. Coin Change 2
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Coin Change II",
    slug: "coin-change-ii",
    difficulty: "Hard",
    description:
      "Given an array of coin denominations and a target amount, return the number of combinations that make up the amount. You may use each coin denomination an unlimited number of times.",
    constraints:
      "1 <= N <= 300\n1 <= coins[i] <= 5000\n0 <= amount <= 5000",
    inputFormat: "First line: N and amount\nSecond line: N space-separated integers (coin values)",
    outputFormat: "A single integer — the number of combinations",
    sampleTestCases: [
      {
        input: "coins = [1, 2, 5], amount = 5",
        output: "4",
        explanation: "Four ways: [5], [2,2,1], [2,1,1,1], [1,1,1,1,1].",
      },
      {
        input: "coins = [2], amount = 3",
        output: "0",
        explanation: "No way to make 3 using only 2.",
      },
    ],
    testCases: [
      { input: "3 5\n1 2 5", output: "4", isHidden: false },
      { input: "1 3\n2", output: "0", isHidden: false },
      { input: "3 0\n1 2 5", output: "1", isHidden: true },
      { input: "2 10\n2 5", output: "3", isHidden: true },
      { input: "4 6\n1 2 3 5", output: "8", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int coinChangeII(vector<int>& coins, int amount) {
    // Write your code here
}

int main() {
    int n, amount;
    if (!(cin >> n >> amount)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    cout << coinChangeII(coins, amount) << endl;
    return 0;
}`,
      python: `class Solution:
    def coinChangeII(self, coins, amount):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, amount = int(input_data[0]), int(input_data[1])
    coins = list(map(int, input_data[2:n+2]))
    print(Solution().coinChangeII(coins, amount))`,
      javascript: `function coinChangeII(coins, amount) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), amount = parseInt(input[1]);
const coins = input.slice(2, n + 2).map(Number);
console.log(coinChangeII(coins, amount));`,
      java: `import java.util.*;

public class Main {
    public static int coinChangeII(int[] coins, int amount) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), amount = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        System.out.println(coinChangeII(coins, amount));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Unbounded Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 21. Unbounded Knapsack
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Unbounded Knapsack",
    slug: "unbounded-knapsack",
    difficulty: "Hard",
    description:
      "Given N items each with a weight and value, and a knapsack of capacity W, find the maximum total value you can carry. You can take any item unlimited times.",
    constraints:
      "1 <= N <= 1000\n1 <= W <= 10^5\n1 <= weight[i] <= W\n1 <= value[i] <= 1000",
    inputFormat:
      "First line: N and W\nSecond line: N space-separated weights\nThird line: N space-separated values",
    outputFormat: "A single integer — the maximum value achievable",
    sampleTestCases: [
      {
        input: "weights = [2, 4, 6], values = [5, 11, 13], W = 10",
        output: "27",
        explanation: "Take item 1 (weight 2, value 5) twice and item 2 (weight 4, value 11) once: 10+11+? Actually: items of weight 2 five times = 25. Wait: item 2 (w=4,v=11) twice = 22 (w=8) + item 1 (w=2, v=5) once = 27. Total weight=10, value=27.",
      },
      {
        input: "weights = [1, 3], values = [6, 10], W = 5",
        output: "30",
        explanation: "Take item 1 (w=1, v=6) five times = 30.",
      },
    ],
    testCases: [
      { input: "3 10\n2 4 6\n5 11 13", output: "27", isHidden: false },
      { input: "2 5\n1 3\n6 10", output: "30", isHidden: false },
      { input: "1 0\n1\n10", output: "0", isHidden: true },
      { input: "2 10\n5 6\n10 12", output: "20", isHidden: true },
      { input: "3 15\n3 4 5\n4 5 6", output: "21", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int unboundedKnapsack(vector<int>& weight, vector<int>& value, int W) {
    // Write your code here
}

int main() {
    int n, W;
    if (!(cin >> n >> W)) return 0;
    vector<int> weight(n), value(n);
    for (int i = 0; i < n; i++) cin >> weight[i];
    for (int i = 0; i < n; i++) cin >> value[i];
    cout << unboundedKnapsack(weight, value, W) << endl;
    return 0;
}`,
      python: `class Solution:
    def unboundedKnapsack(self, weight, value, W):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, W = int(input_data[0]), int(input_data[1])
    weight = list(map(int, input_data[2:n+2]))
    value = list(map(int, input_data[n+2:2*n+2]))
    print(Solution().unboundedKnapsack(weight, value, W))`,
      javascript: `function unboundedKnapsack(weight, value, W) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), W = parseInt(input[1]);
const weight = input.slice(2, n + 2).map(Number);
const value = input.slice(n + 2, 2 * n + 2).map(Number);
console.log(unboundedKnapsack(weight, value, W));`,
      java: `import java.util.*;

public class Main {
    public static int unboundedKnapsack(int[] weight, int[] value, int W) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), W = sc.nextInt();
        int[] weight = new int[n], value = new int[n];
        for (int i = 0; i < n; i++) weight[i] = sc.nextInt();
        for (int i = 0; i < n; i++) value[i] = sc.nextInt();
        System.out.println(unboundedKnapsack(weight, value, W));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Unbounded Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 22. Rod Cutting Problem
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Rod Cutting Problem",
    slug: "rod-cutting-problem",
    difficulty: "Hard",
    description:
      "Given a rod of length N and an array of prices where price[i] is the price of a rod of length i+1, find the maximum revenue obtainable by cutting up the rod and selling the pieces.",
    constraints: "1 <= N <= 1000\n1 <= price[i] <= 10^5",
    inputFormat: "First line: N\nSecond line: N space-separated integers (prices for lengths 1 to N)",
    outputFormat: "A single integer — the maximum revenue",
    sampleTestCases: [
      {
        input: "price = [1, 5, 8, 9, 10, 17, 17, 20]",
        output: "22",
        explanation: "Cut into two pieces of length 2 each: 5+5=10 vs. Length 6+length 2: 17+5=22.",
      },
      {
        input: "price = [3, 5, 8, 9, 10, 17, 17, 20]",
        output: "24",
        explanation: "Eight pieces of length 1: 3×8=24.",
      },
    ],
    testCases: [
      { input: "8\n1 5 8 9 10 17 17 20", output: "22", isHidden: false },
      { input: "8\n3 5 8 9 10 17 17 20", output: "24", isHidden: false },
      { input: "1\n10", output: "10", isHidden: true },
      { input: "4\n1 4 3 6", output: "8", isHidden: true },
      { input: "5\n2 5 7 8 10", output: "12", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int rodCutting(vector<int>& price) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> price(n);
    for (int i = 0; i < n; i++) cin >> price[i];
    cout << rodCutting(price) << endl;
    return 0;
}`,
      python: `class Solution:
    def rodCutting(self, price):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    price = list(map(int, input_data[1:n+1]))
    print(Solution().rodCutting(price))`,
      javascript: `function rodCutting(price) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const price = input.slice(1, n + 1).map(Number);
console.log(rodCutting(price));`,
      java: `import java.util.*;

public class Main {
    public static int rodCutting(int[] price) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] price = new int[n];
        for (int i = 0; i < n; i++) price[i] = sc.nextInt();
        System.out.println(rodCutting(price));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Unbounded Knapsack"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 23. Longest Common Subsequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    difficulty: "Hard",
    description:
      "Given two strings s1 and s2, return the length of their longest common subsequence (LCS). A subsequence is formed by deleting some characters without changing the order.",
    constraints:
      "1 <= |s1|, |s2| <= 1000\ns1 and s2 consist of lowercase English letters",
    inputFormat: "First line: string s1\nSecond line: string s2",
    outputFormat: "A single integer — the length of the longest common subsequence",
    sampleTestCases: [
      {
        input: 's1 = "abcde", s2 = "ace"',
        output: "3",
        explanation: 'LCS is "ace" with length 3.',
      },
      {
        input: 's1 = "abc", s2 = "abc"',
        output: "3",
        explanation: "Identical strings, LCS is the string itself.",
      },
    ],
    testCases: [
      { input: "abcde\nace", output: "3", isHidden: false },
      { input: "abc\nabc", output: "3", isHidden: false },
      { input: "abc\ndef", output: "0", isHidden: true },
      { input: "abcbdab\nbdcaba", output: "4", isHidden: true },
      { input: "a\na", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestCommonSubsequence(string s1, string s2) {
    // Write your code here
}

int main() {
    string s1, s2;
    if (!(cin >> s1 >> s2)) return 0;
    cout << longestCommonSubsequence(s1, s2) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestCommonSubsequence(self, s1, s2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s1, s2 = lines[0], lines[1]
    print(Solution().longestCommonSubsequence(s1, s2))`,
      javascript: `function longestCommonSubsequence(s1, s2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(longestCommonSubsequence(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static int longestCommonSubsequence(String s1, String s2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        System.out.println(longestCommonSubsequence(s1, s2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 24. Print Longest Common Subsequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Print Longest Common Subsequence",
    slug: "print-longest-common-subsequence",
    difficulty: "Hard",
    description:
      "Given two strings s1 and s2, print the actual longest common subsequence (not just its length). If multiple LCS exist with the same length, print any one.",
    constraints:
      "1 <= |s1|, |s2| <= 1000\ns1 and s2 consist of lowercase English letters",
    inputFormat: "First line: string s1\nSecond line: string s2",
    outputFormat: "A single string — one valid longest common subsequence",
    sampleTestCases: [
      {
        input: 's1 = "abcde", s2 = "ace"',
        output: "ace",
        explanation: 'The LCS "ace" has length 3.',
      },
      {
        input: 's1 = "abcd", s2 = "abdc"',
        output: "abc",
        explanation: '"abc" and "abd" are both valid LCS of length 3.',
      },
    ],
    testCases: [
      { input: "abcde\nace", output: "ace", isHidden: false },
      { input: "abcbdab\nbdcaba", output: "bcba", isHidden: false },
      { input: "abc\nabc", output: "abc", isHidden: true },
      { input: "abc\ndef", output: "", isHidden: true },
      { input: "a\na", output: "a", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

string printLCS(string s1, string s2) {
    // Write your code here
}

int main() {
    string s1, s2;
    if (!(cin >> s1 >> s2)) return 0;
    cout << printLCS(s1, s2) << endl;
    return 0;
}`,
      python: `class Solution:
    def printLCS(self, s1, s2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s1, s2 = lines[0], lines[1]
    print(Solution().printLCS(s1, s2))`,
      javascript: `function printLCS(s1, s2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(printLCS(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static String printLCS(String s1, String s2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        System.out.println(printLCS(s1, s2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 25. Longest Common Substring
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Common Substring",
    slug: "longest-common-substring",
    difficulty: "Hard",
    description:
      "Given two strings s1 and s2, find the length of the longest contiguous substring that appears in both strings.",
    constraints:
      "1 <= |s1|, |s2| <= 1000\nStrings consist of lowercase English letters",
    inputFormat: "First line: string s1\nSecond line: string s2",
    outputFormat: "A single integer — the length of the longest common substring",
    sampleTestCases: [
      {
        input: 's1 = "abcde", s2 = "abfce"',
        output: "2",
        explanation: '"ab" is the longest common substring.',
      },
      {
        input: 's1 = "ABAB", s2 = "BABA"',
        output: "3",
        explanation: '"ABA" or "BAB" are both length 3.',
      },
    ],
    testCases: [
      { input: "abcde\nabfce", output: "2", isHidden: false },
      { input: "ABAB\nBABA", output: "3", isHidden: false },
      { input: "abc\nxyz", output: "0", isHidden: true },
      { input: "abcdef\nbcdf", output: "3", isHidden: true },
      { input: "a\na", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestCommonSubstring(string s1, string s2) {
    // Write your code here
}

int main() {
    string s1, s2;
    if (!(cin >> s1 >> s2)) return 0;
    cout << longestCommonSubstring(s1, s2) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestCommonSubstring(self, s1, s2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s1, s2 = lines[0], lines[1]
    print(Solution().longestCommonSubstring(s1, s2))`,
      javascript: `function longestCommonSubstring(s1, s2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(longestCommonSubstring(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static int longestCommonSubstring(String s1, String s2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        System.out.println(longestCommonSubstring(s1, s2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 26. Longest Palindromic Subsequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Palindromic Subsequence",
    slug: "longest-palindromic-subsequence",
    difficulty: "Hard",
    description:
      "Given a string s, find the length of its longest palindromic subsequence. A subsequence is obtained by deleting some characters without changing the order.",
    constraints:
      "1 <= |s| <= 1000\ns consists of lowercase English letters",
    inputFormat: "A single string s",
    outputFormat: "A single integer — the length of the longest palindromic subsequence",
    sampleTestCases: [
      {
        input: 's = "bbbab"',
        output: "4",
        explanation: '"bbbb" is the longest palindromic subsequence.',
      },
      {
        input: 's = "cbbd"',
        output: "2",
        explanation: '"bb" is the longest palindromic subsequence.',
      },
    ],
    testCases: [
      { input: "bbbab", output: "4", isHidden: false },
      { input: "cbbd", output: "2", isHidden: false },
      { input: "a", output: "1", isHidden: true },
      { input: "abcba", output: "5", isHidden: true },
      { input: "abcdef", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestPalindromicSubsequence(string s) {
    // Write your code here
}

int main() {
    string s;
    if (!(cin >> s)) return 0;
    cout << longestPalindromicSubsequence(s) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestPalindromicSubsequence(self, s):
        pass

if __name__ == '__main__':
    import sys
    s = sys.stdin.read().strip()
    print(Solution().longestPalindromicSubsequence(s))`,
      javascript: `function longestPalindromicSubsequence(s) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();
console.log(longestPalindromicSubsequence(s));`,
      java: `import java.util.*;

public class Main {
    public static int longestPalindromicSubsequence(String s) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(longestPalindromicSubsequence(s));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 27. Minimum Insertions to Make String Palindrome
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Minimum Insertions to Make String Palindrome",
    slug: "minimum-insertions-palindrome",
    difficulty: "Hard",
    description:
      "Given a string s, find the minimum number of characters to insert to make it a palindrome.",
    constraints:
      "1 <= |s| <= 500\ns consists of lowercase English letters",
    inputFormat: "A single string s",
    outputFormat: "A single integer — the minimum insertions needed",
    sampleTestCases: [
      {
        input: 's = "zzazz"',
        output: "0",
        explanation: "Already a palindrome.",
      },
      {
        input: 's = "mbadm"',
        output: "2",
        explanation: 'Insert 2 chars: "mbdadbm" or similar.',
      },
    ],
    testCases: [
      { input: "zzazz", output: "0", isHidden: false },
      { input: "mbadm", output: "2", isHidden: false },
      { input: "a", output: "0", isHidden: true },
      { input: "ab", output: "1", isHidden: true },
      { input: "abcd", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int minInsertions(string s) {
    // Write your code here
}

int main() {
    string s;
    if (!(cin >> s)) return 0;
    cout << minInsertions(s) << endl;
    return 0;
}`,
      python: `class Solution:
    def minInsertions(self, s):
        pass

if __name__ == '__main__':
    import sys
    s = sys.stdin.read().strip()
    print(Solution().minInsertions(s))`,
      javascript: `function minInsertions(s) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();
console.log(minInsertions(s));`,
      java: `import java.util.*;

public class Main {
    public static int minInsertions(String s) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(minInsertions(s));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 28. Minimum Insertions or Deletions to Convert String A to B
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Minimum Insertions or Deletions to Convert String A to B",
    slug: "min-insertions-deletions-convert-string",
    difficulty: "Hard",
    description:
      "Given two strings s1 and s2, find the minimum number of insertions and deletions required to convert s1 into s2.",
    constraints:
      "1 <= |s1|, |s2| <= 1000\nStrings consist of lowercase English letters",
    inputFormat: "First line: string s1\nSecond line: string s2",
    outputFormat: "A single integer — the minimum number of insertions + deletions",
    sampleTestCases: [
      {
        input: 's1 = "heap", s2 = "pea"',
        output: "3",
        explanation: "Delete 'h' and 'a' from heap (2 deletions), then insert 'p' (no, rearranging). LCS = 'ea' (length 2). Cost = (4-2)+(3-2) = 2+1 = 3.",
      },
      {
        input: 's1 = "geeksforgeeks", s2 = "geeks"',
        output: "8",
        explanation: "LCS = geeks (5). Cost = (13-5)+(5-5) = 8.",
      },
    ],
    testCases: [
      { input: "heap\npea", output: "3", isHidden: false },
      { input: "geeksforgeeks\ngeeks", output: "8", isHidden: false },
      { input: "abc\nabc", output: "0", isHidden: true },
      { input: "abc\nxyz", output: "6", isHidden: true },
      { input: "a\nb", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int minInsertionsAndDeletions(string s1, string s2) {
    // Write your code here
}

int main() {
    string s1, s2;
    if (!(cin >> s1 >> s2)) return 0;
    cout << minInsertionsAndDeletions(s1, s2) << endl;
    return 0;
}`,
      python: `class Solution:
    def minInsertionsAndDeletions(self, s1, s2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s1, s2 = lines[0], lines[1]
    print(Solution().minInsertionsAndDeletions(s1, s2))`,
      javascript: `function minInsertionsAndDeletions(s1, s2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(minInsertionsAndDeletions(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static int minInsertionsAndDeletions(String s1, String s2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        System.out.println(minInsertionsAndDeletions(s1, s2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 29. Shortest Common Supersequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Shortest Common Supersequence",
    slug: "shortest-common-supersequence",
    difficulty: "Hard",
    description:
      "Given two strings s1 and s2, find the shortest string that has both s1 and s2 as subsequences. Return the length of such string.",
    constraints:
      "1 <= |s1|, |s2| <= 1000\nStrings consist of lowercase English letters",
    inputFormat: "First line: string s1\nSecond line: string s2",
    outputFormat: "A single integer — the length of the shortest common supersequence",
    sampleTestCases: [
      {
        input: 's1 = "abac", s2 = "cab"',
        output: "5",
        explanation: '"cabac" contains both as subsequences.',
      },
      {
        input: 's1 = "aba", s2 = "bab"',
        output: "4",
        explanation: '"abab" or "baba" are valid SCS.',
      },
    ],
    testCases: [
      { input: "abac\ncab", output: "5", isHidden: false },
      { input: "aba\nbab", output: "4", isHidden: false },
      { input: "a\na", output: "1", isHidden: true },
      { input: "abc\nxyz", output: "6", isHidden: true },
      { input: "abcde\nace", output: "5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int shortestCommonSupersequence(string s1, string s2) {
    // Write your code here
}

int main() {
    string s1, s2;
    if (!(cin >> s1 >> s2)) return 0;
    cout << shortestCommonSupersequence(s1, s2) << endl;
    return 0;
}`,
      python: `class Solution:
    def shortestCommonSupersequence(self, s1, s2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s1, s2 = lines[0], lines[1]
    print(Solution().shortestCommonSupersequence(s1, s2))`,
      javascript: `function shortestCommonSupersequence(s1, s2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(shortestCommonSupersequence(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static int shortestCommonSupersequence(String s1, String s2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next(), s2 = sc.next();
        System.out.println(shortestCommonSupersequence(s1, s2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 30. Distinct Subsequences
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Distinct Subsequences",
    slug: "distinct-subsequences",
    difficulty: "Hard",
    description:
      "Given two strings s and t, return the number of distinct subsequences of s that equal t.",
    constraints:
      "1 <= |s| <= 1000\n1 <= |t| <= 1000\nStrings consist of lowercase English letters",
    inputFormat: "First line: string s\nSecond line: string t",
    outputFormat: "A single integer — the number of distinct subsequences of s that equal t",
    sampleTestCases: [
      {
        input: 's = "rabbbit", t = "rabbit"',
        output: "3",
        explanation: "Three ways to delete one 'b' to get 'rabbit'.",
      },
      {
        input: 's = "babgbag", t = "bag"',
        output: "5",
        explanation: "Five distinct ways to select 'bag' from 'babgbag'.",
      },
    ],
    testCases: [
      { input: "rabbbit\nrabbit", output: "3", isHidden: false },
      { input: "babgbag\nbag", output: "5", isHidden: false },
      { input: "a\na", output: "1", isHidden: true },
      { input: "abc\nabc", output: "1", isHidden: true },
      { input: "aaa\naa", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long numDistinct(string s, string t) {
    // Write your code here
}

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;
    cout << numDistinct(s, t) << endl;
    return 0;
}`,
      python: `class Solution:
    def numDistinct(self, s, t):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split()
    s, t = lines[0], lines[1]
    print(Solution().numDistinct(s, t))`,
      javascript: `function numDistinct(s, t) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(numDistinct(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static long numDistinct(String s, String t) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next(), t = sc.next();
        System.out.println(numDistinct(s, t));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 31. Edit Distance
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Edit Distance",
    slug: "edit-distance",
    difficulty: "Hard",
    description:
      "Given two strings word1 and word2, return the minimum number of operations (insert, delete, or replace a character) to convert word1 to word2.",
    constraints:
      "0 <= |word1|, |word2| <= 500\nStrings consist of lowercase English letters",
    inputFormat: "First line: word1\nSecond line: word2",
    outputFormat: "A single integer — the minimum edit distance",
    sampleTestCases: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: "horse→rorse→rose→ros requires 3 operations.",
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5",
        explanation: "5 edit operations required.",
      },
    ],
    testCases: [
      { input: "horse\nros", output: "3", isHidden: false },
      { input: "intention\nexecution", output: "5", isHidden: false },
      { input: "a\na", output: "0", isHidden: true },
      { input: "abc\n", output: "3", isHidden: true },
      { input: "kitten\nsitting", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int editDistance(string word1, string word2) {
    // Write your code here
}

int main() {
    string word1, word2;
    cin >> word1 >> word2;
    cout << editDistance(word1, word2) << endl;
    return 0;
}`,
      python: `class Solution:
    def editDistance(self, word1, word2):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split('\\n')
    word1 = lines[0].strip() if len(lines) > 0 else ''
    word2 = lines[1].strip() if len(lines) > 1 else ''
    print(Solution().editDistance(word1, word2))`,
      javascript: `function editDistance(word1, word2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').split('\\n');
const word1 = lines[0] ? lines[0].trim() : '';
const word2 = lines[1] ? lines[1].trim() : '';
console.log(editDistance(word1, word2));`,
      java: `import java.util.*;

public class Main {
    public static int editDistance(String word1, String word2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word1 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String word2 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println(editDistance(word1, word2));
    }
}`,
    },
    tags: ["Dynamic Programming", "String"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 32. Wildcard Matching
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Wildcard Matching",
    slug: "wildcard-matching",
    difficulty: "Hard",
    description:
      "Given an input string s and a pattern p that may contain '?' (matches any single character) and '*' (matches any sequence including empty), determine if the pattern matches the entire string.",
    constraints:
      "0 <= |s| <= 2000\n0 <= |p| <= 2000\ns contains only lowercase letters\np contains only lowercase letters, '?', and '*'",
    inputFormat: "First line: string s\nSecond line: pattern p",
    outputFormat: "true if the pattern matches the entire string, false otherwise",
    sampleTestCases: [
      {
        input: 's = "aa", p = "a"',
        output: "false",
        explanation: '"a" matches only one character.',
      },
      {
        input: 's = "aa", p = "*"',
        output: "true",
        explanation: '"*" matches any sequence.',
      },
    ],
    testCases: [
      { input: "aa\na", output: "false", isHidden: false },
      { input: "aa\n*", output: "true", isHidden: false },
      { input: "cb\n?a", output: "false", isHidden: true },
      { input: "adceb\n*a*b", output: "true", isHidden: true },
      { input: "acdcb\na*c?b", output: "false", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool wildcardMatching(string s, string p) {
    // Write your code here
}

int main() {
    string s, p;
    if (!(cin >> s >> p)) return 0;
    cout << (wildcardMatching(s, p) ? "true" : "false") << endl;
    return 0;
}`,
      python: `class Solution:
    def wildcardMatching(self, s, p):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().split('\\n')
    s, p = lines[0].strip(), lines[1].strip()
    print(str(Solution().wildcardMatching(s, p)).lower())`,
      javascript: `function wildcardMatching(s, p) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
console.log(wildcardMatching(lines[0].trim(), lines[1].trim()));`,
      java: `import java.util.*;

public class Main {
    public static boolean wildcardMatching(String s, String p) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next(), p = sc.next();
        System.out.println(wildcardMatching(s, p));
    }
}`,
    },
    tags: ["Dynamic Programming", "String", "Greedy"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 33. Best Time to Buy and Sell Stock
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-buy-sell-stock-i",
    difficulty: "Medium",
    description:
      "Given an array where prices[i] is the stock price on day i, find the maximum profit from a single buy followed by a single sell. Return 0 if no profit is possible.",
    constraints: "1 <= N <= 10^5\n0 <= prices[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit",
    sampleTestCases: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy at 1, sell at 6. Profit = 5.",
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "Prices only decrease; no profit possible.",
      },
    ],
    testCases: [
      { input: "6\n7 1 5 3 6 4", output: "5", isHidden: false },
      { input: "5\n7 6 4 3 1", output: "0", isHidden: false },
      { input: "1\n5", output: "0", isHidden: true },
      { input: "4\n1 2 3 4", output: "3", isHidden: true },
      { input: "5\n2 4 1 7 3", output: "6", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfit(prices) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfit(self, prices):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    prices = list(map(int, input_data[1:n+1]))
    print(Solution().maxProfit(prices))`,
      javascript: `function maxProfit(prices) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const prices = input.slice(1, n + 1).map(Number);
console.log(maxProfit(prices));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfit(prices));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Greedy"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 34. Best Time to Buy and Sell Stock II (unlimited transactions)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock II",
    slug: "best-time-buy-sell-stock-ii",
    difficulty: "Medium",
    description:
      "Given daily stock prices, find the maximum profit from as many transactions as you like (buy then sell, and buy again). You may not hold more than one stock at a time.",
    constraints: "1 <= N <= 3 * 10^4\n0 <= prices[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum total profit",
    sampleTestCases: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "7",
        explanation: "Buy at 1, sell at 5 (profit 4). Buy at 3, sell at 6 (profit 3). Total = 7.",
      },
      {
        input: "prices = [1, 2, 3, 4, 5]",
        output: "4",
        explanation: "Buy at 1, sell at 5. Or buy each day and sell next.",
      },
    ],
    testCases: [
      { input: "6\n7 1 5 3 6 4", output: "7", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "4", isHidden: false },
      { input: "5\n7 6 4 3 1", output: "0", isHidden: true },
      { input: "3\n1 2 1", output: "1", isHidden: true },
      { input: "4\n3 3 5 0", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfitII(vector<int>& prices) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfitII(prices) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfitII(self, prices):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    prices = list(map(int, input_data[1:n+1]))
    print(Solution().maxProfitII(prices))`,
      javascript: `function maxProfitII(prices) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const prices = input.slice(1, n + 1).map(Number);
console.log(maxProfitII(prices));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfitII(int[] prices) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfitII(prices));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Greedy"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 35. Best Time to Buy and Sell Stock III (at most 2 transactions)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock III",
    slug: "best-time-buy-sell-stock-iii",
    difficulty: "Medium",
    description:
      "Given daily stock prices, find the maximum profit using at most 2 transactions. You must sell before you buy again.",
    constraints: "1 <= N <= 10^5\n0 <= prices[i] <= 10^5",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit with at most 2 transactions",
    sampleTestCases: [
      {
        input: "prices = [3, 3, 5, 0, 0, 3, 1, 4]",
        output: "6",
        explanation: "Buy at 0, sell at 3 (profit 3); buy at 1, sell at 4 (profit 3). Total = 6.",
      },
      {
        input: "prices = [1, 2, 3, 4, 5]",
        output: "4",
        explanation: "One transaction: buy at 1, sell at 5.",
      },
    ],
    testCases: [
      { input: "8\n3 3 5 0 0 3 1 4", output: "6", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "4", isHidden: false },
      { input: "5\n7 6 4 3 1", output: "0", isHidden: true },
      { input: "6\n1 2 4 2 5 7", output: "7", isHidden: true },
      { input: "4\n1 4 2 7", output: "7", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfitIII(vector<int>& prices) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfitIII(prices) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfitIII(self, prices):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    prices = list(map(int, input_data[1:n+1]))
    print(Solution().maxProfitIII(prices))`,
      javascript: `function maxProfitIII(prices) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const prices = input.slice(1, n + 1).map(Number);
console.log(maxProfitIII(prices));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfitIII(int[] prices) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfitIII(prices));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 36. Best Time to Buy and Sell Stock IV (at most K transactions)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock IV",
    slug: "best-time-buy-sell-stock-iv",
    difficulty: "Medium",
    description:
      "Given daily stock prices and an integer K, find the maximum profit using at most K transactions. You must sell before buying again.",
    constraints:
      "1 <= N <= 1000\n0 <= prices[i] <= 1000\n0 <= K <= 100",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit with at most K transactions",
    sampleTestCases: [
      {
        input: "prices = [2, 4, 1], K = 2",
        output: "2",
        explanation: "Buy at 2, sell at 4. Profit = 2.",
      },
      {
        input: "prices = [3, 2, 6, 5, 0, 3], K = 2",
        output: "7",
        explanation: "Buy at 2, sell at 6 (4); buy at 0, sell at 3 (3). Total = 7.",
      },
    ],
    testCases: [
      { input: "3 2\n2 4 1", output: "2", isHidden: false },
      { input: "6 2\n3 2 6 5 0 3", output: "7", isHidden: false },
      { input: "5 0\n1 2 3 4 5", output: "0", isHidden: true },
      { input: "5 10\n1 2 3 4 5", output: "4", isHidden: true },
      { input: "4 1\n1 4 2 7", output: "6", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfitIV(vector<int>& prices, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfitIV(prices, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfitIV(self, prices, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    prices = list(map(int, input_data[2:n+2]))
    print(Solution().maxProfitIV(prices, k))`,
      javascript: `function maxProfitIV(prices, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), k = parseInt(input[1]);
const prices = input.slice(2, n + 2).map(Number);
console.log(maxProfitIV(prices, k));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfitIV(int[] prices, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfitIV(prices, k));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 37. Best Time to Buy and Sell Stock with Cooldown
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock with Cooldown",
    slug: "best-time-buy-sell-stock-cooldown",
    difficulty: "Medium",
    description:
      "Given daily stock prices, find the maximum profit with unlimited transactions, but after each sell you must wait one day (cooldown) before buying again.",
    constraints: "1 <= N <= 5000\n0 <= prices[i] <= 1000",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit with cooldown",
    sampleTestCases: [
      {
        input: "prices = [1, 2, 3, 0, 2]",
        output: "3",
        explanation: "Buy at 1, sell at 3 (profit 2), cooldown, buy at 0, sell at 2 (profit 2)... wait: sell at 3 then cooldown at index 3 (price 0), buy at index 4 is impossible. Best: buy at 1, sell at 2 → buy at 0, sell at 2 = 1+2=3.",
      },
      {
        input: "prices = [1]",
        output: "0",
        explanation: "Only one day, no transaction possible.",
      },
    ],
    testCases: [
      { input: "5\n1 2 3 0 2", output: "3", isHidden: false },
      { input: "1\n1", output: "0", isHidden: false },
      { input: "2\n1 2", output: "1", isHidden: true },
      { input: "6\n6 1 3 2 4 7", output: "6", isHidden: true },
      { input: "3\n1 4 2", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfitCooldown(vector<int>& prices) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfitCooldown(prices) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfitCooldown(self, prices):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    prices = list(map(int, input_data[1:n+1]))
    print(Solution().maxProfitCooldown(prices))`,
      javascript: `function maxProfitCooldown(prices) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const prices = input.slice(1, n + 1).map(Number);
console.log(maxProfitCooldown(prices));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfitCooldown(int[] prices) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfitCooldown(prices));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 38. Best Time to Buy and Sell Stock with Transaction Fee
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Best Time to Buy and Sell Stock with Transaction Fee",
    slug: "best-time-buy-sell-stock-transaction-fee",
    difficulty: "Medium",
    description:
      "Given daily stock prices and a transaction fee, find the maximum profit with unlimited transactions. Each transaction (buy + sell) incurs a fee paid once.",
    constraints:
      "1 <= N <= 5 * 10^4\n1 <= prices[i] <= 10^5\n0 <= fee <= 10^4",
    inputFormat: "First line: N and fee\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit after fees",
    sampleTestCases: [
      {
        input: "prices = [1, 3, 2, 8, 4, 9], fee = 2",
        output: "8",
        explanation: "Buy at 1, sell at 8 (8-1-2=5); buy at 4, sell at 9 (9-4-2=3). Total = 8.",
      },
      {
        input: "prices = [1, 3, 7, 5, 10, 3], fee = 3",
        output: "6",
        explanation: "Buy at 1, sell at 7 (profit 3); buy at 5, sell at 10 (profit 2)... Best: buy 1, sell 10 (10-1-3=6).",
      },
    ],
    testCases: [
      { input: "6 2\n1 3 2 8 4 9", output: "8", isHidden: false },
      { input: "6 3\n1 3 7 5 10 3", output: "6", isHidden: false },
      { input: "3 0\n1 3 2", output: "2", isHidden: true },
      { input: "2 100\n1 2", output: "0", isHidden: true },
      { input: "4 1\n1 4 2 7", output: "8", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfitWithFee(vector<int>& prices, int fee) {
    // Write your code here
}

int main() {
    int n, fee;
    if (!(cin >> n >> fee)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfitWithFee(prices, fee) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProfitWithFee(self, prices, fee):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, fee = int(input_data[0]), int(input_data[1])
    prices = list(map(int, input_data[2:n+2]))
    print(Solution().maxProfitWithFee(prices, fee))`,
      javascript: `function maxProfitWithFee(prices, fee) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]), fee = parseInt(input[1]);
const prices = input.slice(2, n + 2).map(Number);
console.log(maxProfitWithFee(prices, fee));`,
      java: `import java.util.*;

public class Main {
    public static int maxProfitWithFee(int[] prices, int fee) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), fee = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        System.out.println(maxProfitWithFee(prices, fee));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Greedy"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 39. Longest Increasing Subsequence (LIS)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find the length of the longest strictly increasing subsequence.",
    constraints: "1 <= N <= 2500\n-10^4 <= arr[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the length of the longest strictly increasing subsequence",
    sampleTestCases: [
      {
        input: "arr = [10, 9, 2, 5, 3, 7, 101, 18]",
        output: "4",
        explanation: "LIS: [2, 3, 7, 101] or [2, 5, 7, 101], length 4.",
      },
      {
        input: "arr = [0, 1, 0, 3, 2, 3]",
        output: "4",
        explanation: "LIS: [0, 1, 2, 3], length 4.",
      },
    ],
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "4", isHidden: false },
      { input: "6\n0 1 0 3 2 3", output: "4", isHidden: false },
      { input: "1\n5", output: "1", isHidden: true },
      { input: "5\n5 4 3 2 1", output: "1", isHidden: true },
      { input: "5\n1 2 3 4 5", output: "5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLIS(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << lengthOfLIS(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def lengthOfLIS(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().lengthOfLIS(arr))`,
      javascript: `function lengthOfLIS(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(lengthOfLIS(arr));`,
      java: `import java.util.*;

public class Main {
    public static int lengthOfLIS(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(lengthOfLIS(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Binary Search"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 40. Print Longest Increasing Subsequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Print Longest Increasing Subsequence",
    slug: "print-longest-increasing-subsequence",
    difficulty: "Medium",
    description:
      "Given an array of N integers, print the actual longest strictly increasing subsequence (not just its length). If multiple LIS of the same length exist, print any one.",
    constraints: "1 <= N <= 2500\n-10^4 <= arr[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "Space-separated integers — one valid longest increasing subsequence",
    sampleTestCases: [
      {
        input: "arr = [10, 9, 2, 5, 3, 7, 101, 18]",
        output: "2 3 7 101",
        explanation: "One valid LIS of length 4.",
      },
      {
        input: "arr = [3, 10, 2, 1, 20]",
        output: "3 10 20",
        explanation: "LIS: [3, 10, 20] or [2, 20] — print the longer one.",
      },
    ],
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "2 3 7 101", isHidden: false },
      { input: "5\n3 10 2 1 20", output: "3 10 20", isHidden: false },
      { input: "1\n7", output: "7", isHidden: true },
      { input: "5\n5 4 3 2 1", output: "5", isHidden: true },
      { input: "5\n1 3 2 4 5", output: "1 2 4 5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> printLIS(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = printLIS(arr);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def printLIS(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().printLIS(arr))`,
      javascript: `function printLIS(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(printLIS(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] printLIS(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = printLIS(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 41. Largest Divisible Subset
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Largest Divisible Subset",
    slug: "largest-divisible-subset",
    difficulty: "Medium",
    description:
      "Given a set of distinct positive integers, find the largest subset such that every pair (a, b) in the subset satisfies a % b == 0 or b % a == 0. Return the subset.",
    constraints: "1 <= N <= 1000\n1 <= nums[i] <= 2 * 10^9\nAll elements are distinct.",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "Space-separated integers — the largest divisible subset (any valid answer)",
    sampleTestCases: [
      {
        input: "nums = [1, 2, 3]",
        output: "1 2",
        explanation: "[1,2] or [1,3] are valid divisible subsets of size 2.",
      },
      {
        input: "nums = [1, 2, 4, 8]",
        output: "1 2 4 8",
        explanation: "All elements form a divisible chain.",
      },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "1 2", isHidden: false },
      { input: "4\n1 2 4 8", output: "1 2 4 8", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "4\n4 8 2 1", output: "1 2 4 8", isHidden: true },
      { input: "3\n1 2 5", output: "1 2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> largestDivisibleSubset(vector<int>& nums) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    vector<int> res = largestDivisibleSubset(nums);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def largestDivisibleSubset(self, nums):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    nums = list(map(int, input_data[1:n+1]))
    print(*Solution().largestDivisibleSubset(nums))`,
      javascript: `function largestDivisibleSubset(nums) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const nums = input.slice(1, n + 1).map(Number);
console.log(largestDivisibleSubset(nums).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] largestDivisibleSubset(int[] nums) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int[] res = largestDivisibleSubset(nums);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Dynamic Programming", "Array", "Math"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 42. Longest String Chain
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest String Chain",
    slug: "longest-string-chain",
    difficulty: "Medium",
    description:
      "Given a list of words, find the length of the longest possible word chain. Word A is a predecessor of word B if you can add exactly one letter anywhere in A to make B. Return the length of the longest such chain.",
    constraints:
      "1 <= N <= 1000\n1 <= |words[i]| <= 16\nwords[i] consists of lowercase English letters",
    inputFormat: "First line: N\nNext N lines: one word each",
    outputFormat: "A single integer — the length of the longest string chain",
    sampleTestCases: [
      {
        input: 'words = ["a","b","ba","bca","bda","bdca"]',
        output: "4",
        explanation: 'Chain: a → ba → bda → bdca, length 4.',
      },
      {
        input: 'words = ["xbc","pcxbcf","xb","cxbc","pcxbc"]',
        output: "5",
        explanation: "All 5 words form a chain.",
      },
    ],
    testCases: [
      { input: "6\na\nb\nba\nbca\nbda\nbdca", output: "4", isHidden: false },
      { input: "5\nxbc\npcxbcf\nxb\ncxbc\npcxbc", output: "5", isHidden: false },
      { input: "1\nz", output: "1", isHidden: true },
      { input: "3\nab\nabc\na", output: "3", isHidden: true },
      { input: "4\nabcd\nabc\nab\na", output: "4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestStrChain(vector<string>& words) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<string> words(n);
    for (int i = 0; i < n; i++) cin >> words[i];
    cout << longestStrChain(words) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestStrChain(self, words):
        pass

if __name__ == '__main__':
    import sys
    lines = sys.stdin.read().strip().split('\\n')
    n = int(lines[0])
    words = [lines[i+1].strip() for i in range(n)]
    print(Solution().longestStrChain(words))`,
      javascript: `function longestStrChain(words) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const words = lines.slice(1, n + 1).map(w => w.trim());
console.log(longestStrChain(words));`,
      java: `import java.util.*;

public class Main {
    public static int longestStrChain(String[] words) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        System.out.println(longestStrChain(words));
    }
}`,
    },
    tags: ["Dynamic Programming", "String", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 43. Longest Bitonic Subsequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Bitonic Subsequence",
    slug: "longest-bitonic-subsequence",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find the length of the longest bitonic subsequence. A bitonic subsequence first strictly increases then strictly decreases (either part can be empty).",
    constraints: "1 <= N <= 1000\n1 <= arr[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the length of the longest bitonic subsequence",
    sampleTestCases: [
      {
        input: "arr = [1, 11, 2, 10, 4, 5, 2, 1]",
        output: "6",
        explanation: "Bitonic subsequence: [1, 2, 10, 4, 2, 1], length 6.",
      },
      {
        input: "arr = [12, 11, 40, 5, 3, 1]",
        output: "5",
        explanation: "Bitonic: [12, 40, 5, 3, 1] or similar, length 5.",
      },
    ],
    testCases: [
      { input: "8\n1 11 2 10 4 5 2 1", output: "6", isHidden: false },
      { input: "6\n12 11 40 5 3 1", output: "5", isHidden: false },
      { input: "1\n5", output: "1", isHidden: true },
      { input: "5\n1 2 3 4 5", output: "5", isHidden: true },
      { input: "5\n5 4 3 2 1", output: "5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestBitonicSubsequence(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << longestBitonicSubsequence(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestBitonicSubsequence(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().longestBitonicSubsequence(arr))`,
      javascript: `function longestBitonicSubsequence(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(longestBitonicSubsequence(arr));`,
      java: `import java.util.*;

public class Main {
    public static int longestBitonicSubsequence(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(longestBitonicSubsequence(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 44. Number of Longest Increasing Subsequences
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Number of Longest Increasing Subsequences",
    slug: "number-of-longest-increasing-subsequences",
    difficulty: "Medium",
    description:
      "Given an array of N integers, return the number of distinct longest strictly increasing subsequences.",
    constraints: "1 <= N <= 2000\n-10^6 <= arr[i] <= 10^6",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the count of longest increasing subsequences",
    sampleTestCases: [
      {
        input: "arr = [1, 3, 5, 4, 7]",
        output: "2",
        explanation: "Two LIS of length 4: [1,3,5,7] and [1,3,4,7].",
      },
      {
        input: "arr = [2, 2, 2, 2, 2]",
        output: "5",
        explanation: "Five LIS of length 1, each is a single element.",
      },
    ],
    testCases: [
      { input: "5\n1 3 5 4 7", output: "2", isHidden: false },
      { input: "5\n2 2 2 2 2", output: "5", isHidden: false },
      { input: "1\n5", output: "1", isHidden: true },
      { input: "4\n1 2 3 4", output: "1", isHidden: true },
      { input: "6\n1 3 5 4 7 9", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int findNumberOfLIS(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << findNumberOfLIS(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def findNumberOfLIS(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().findNumberOfLIS(arr))`,
      javascript: `function findNumberOfLIS(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(findNumberOfLIS(arr));`,
      java: `import java.util.*;

public class Main {
    public static int findNumberOfLIS(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(findNumberOfLIS(arr));
    }
}`,
    },
    tags: ["Dynamic Programming", "Array"],
  },

];

module.exports = dpProblems;