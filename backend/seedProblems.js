const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const problems = [
  // ─────────────────────────────────────────────────────────────────
  // 1. Largest Element
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Largest Element in an Array",
    slug: "largest-element-in-array",
    difficulty: "Easy",
    description:
      "Given an array of N integers, find the largest element present in the array.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the largest element in the array",
    sampleTestCases: [
      {
        input: "arr = [3, 1, 4, 1, 5, 9, 2, 6]",
        output: "9",
        explanation: "9 is the maximum value in the array.",
      },
      {
        input: "arr = [-3, -1, -4]",
        output: "-1",
        explanation: "-1 is the largest among negative numbers.",
      },
    ],
    testCases: [
      { input: "8\n3 1 4 1 5 9 2 6", output: "9", isHidden: false },
      { input: "3\n-3 -1 -4", output: "-1", isHidden: false },
      { input: "1\n42", output: "42", isHidden: true },
      { input: "5\n100 200 300 400 500", output: "500", isHidden: true },
      { input: "6\n7 7 7 7 7 7", output: "7", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int largestElement(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << largestElement(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def largestElement(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().largestElement(arr))`,
      javascript: `function largestElement(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(largestElement(arr));`,
      java: `import java.util.*;

public class Main {
    public static int largestElement(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(largestElement(arr));
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Second Largest Element
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Second Largest Element in an Array",
    slug: "second-largest-element",
    difficulty: "Easy",
    description:
      "Given an array of N integers, find the second largest distinct element. If no second largest element exists, return -1.",
    constraints: "2 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "A single integer — the second largest distinct element, or -1 if it doesn't exist",
    sampleTestCases: [
      {
        input: "arr = [10, 5, 10, 3]",
        output: "5",
        explanation:
          "The largest is 10. The second largest distinct element is 5.",
      },
      {
        input: "arr = [5, 5, 5]",
        output: "-1",
        explanation: "All elements are equal, so there is no second largest.",
      },
    ],
    testCases: [
      { input: "4\n10 5 10 3", output: "5", isHidden: false },
      { input: "3\n5 5 5", output: "-1", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "4", isHidden: true },
      { input: "2\n100 200", output: "100", isHidden: true },
      { input: "4\n-1 -2 -3 -4", output: "-2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int secondLargest(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << secondLargest(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def secondLargest(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().secondLargest(arr))`,
      javascript: `function secondLargest(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(secondLargest(arr));`,
      java: `import java.util.*;

public class Main {
    public static int secondLargest(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(secondLargest(arr));
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Check if Array is Sorted
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Check if the Array is Sorted",
    slug: "check-array-sorted",
    difficulty: "Easy",
    description:
      "Given an array of N integers, check whether the array is sorted in non-decreasing order. Return true if sorted, false otherwise.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "true if the array is sorted in non-decreasing order, false otherwise",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 4, 5]",
        output: "true",
        explanation: "Each element is less than or equal to the next.",
      },
      {
        input: "arr = [5, 3, 1]",
        output: "false",
        explanation: "5 > 3, so the array is not sorted.",
      },
    ],
    testCases: [
      { input: "5\n1 2 3 4 5", output: "true", isHidden: false },
      { input: "3\n5 3 1", output: "false", isHidden: false },
      { input: "4\n1 1 1 1", output: "true", isHidden: true },
      { input: "1\n99", output: "true", isHidden: true },
      { input: "5\n1 2 2 3 2", output: "false", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isSorted(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << (isSorted(arr) ? "true" : "false") << endl;
    return 0;
}`,
      python: `class Solution:
    def isSorted(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(str(Solution().isSorted(arr)).lower())`,
      javascript: `function isSorted(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(isSorted(arr));`,
      java: `import java.util.*;

public class Main {
    public static boolean isSorted(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(isSorted(arr));
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Remove Duplicates from Sorted Array
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Remove Duplicates from Sorted Array",
    slug: "remove-duplicates-sorted-array",
    difficulty: "Easy",
    description:
      "Given a sorted array of N integers, remove duplicates in-place such that each unique element appears only once. Return the count of unique elements. The relative order of the elements should be kept the same.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9\nThe array is sorted in non-decreasing order.",
    inputFormat: "First line: N\nSecond line: N space-separated integers (sorted)",
    outputFormat: "A single integer — the number of unique elements",
    sampleTestCases: [
      {
        input: "arr = [1, 1, 2, 2, 3]",
        output: "3",
        explanation: "Unique elements are [1, 2, 3], count = 3.",
      },
      {
        input: "arr = [1, 2, 3, 4, 5]",
        output: "5",
        explanation: "All elements are already unique.",
      },
    ],
    testCases: [
      { input: "5\n1 1 2 2 3", output: "3", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "5", isHidden: false },
      { input: "6\n0 0 1 1 1 2", output: "3", isHidden: true },
      { input: "1\n7", output: "1", isHidden: true },
      { input: "5\n5 5 5 5 5", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int removeDuplicates(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << removeDuplicates(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def removeDuplicates(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().removeDuplicates(arr))`,
      javascript: `function removeDuplicates(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(removeDuplicates(arr));`,
      java: `import java.util.*;

public class Main {
    public static int removeDuplicates(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(removeDuplicates(arr));
    }
}`,
    },
    tags: ["Array", "Two Pointers"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. Left Rotate Array by One
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Left Rotate Array by One",
    slug: "left-rotate-array-by-one",
    difficulty: "Easy",
    description:
      "Given an array of N integers, left rotate the array by one position. The first element should move to the last position.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "N space-separated integers — the rotated array",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 4, 5]",
        output: "2 3 4 5 1",
        explanation: "The first element 1 moves to the end.",
      },
      {
        input: "arr = [3]",
        output: "3",
        explanation: "Single element array stays the same.",
      },
    ],
    testCases: [
      { input: "5\n1 2 3 4 5", output: "2 3 4 5 1", isHidden: false },
      { input: "1\n3", output: "3", isHidden: false },
      { input: "4\n10 20 30 40", output: "20 30 40 10", isHidden: true },
      { input: "3\n-1 -2 -3", output: "-2 -3 -1", isHidden: true },
      { input: "6\n5 5 5 5 5 5", output: "5 5 5 5 5 5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> rotateByOne(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = rotateByOne(arr);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def rotateByOne(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().rotateByOne(arr))`,
      javascript: `function rotateByOne(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(rotateByOne(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] rotateByOne(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = rotateByOne(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. Left Rotate Array by K Places
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Left Rotate Array by K Places",
    slug: "left-rotate-array-by-k",
    difficulty: "Easy",
    description:
      "Given an array of N integers and a number K, left rotate the array by K positions. Elements that fall off the left end reappear on the right.",
    constraints:
      "1 <= N <= 10^5\n1 <= K <= 10^9\n-10^9 <= arr[i] <= 10^9",
    inputFormat:
      "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "N space-separated integers — the rotated array",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 4, 5], K = 2",
        output: "3 4 5 1 2",
        explanation: "After rotating left by 2: [3, 4, 5, 1, 2].",
      },
      {
        input: "arr = [1, 2, 3], K = 4",
        output: "2 3 1",
        explanation: "K = 4 is equivalent to K = 1 (4 % 3 = 1).",
      },
    ],
    testCases: [
      { input: "5 2\n1 2 3 4 5", output: "3 4 5 1 2", isHidden: false },
      { input: "3 4\n1 2 3", output: "2 3 1", isHidden: false },
      { input: "4 4\n10 20 30 40", output: "10 20 30 40", isHidden: true },
      { input: "5 1\n5 4 3 2 1", output: "4 3 2 1 5", isHidden: true },
      { input: "6 3\n1 2 3 4 5 6", output: "4 5 6 1 2 3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> rotateByK(vector<int>& arr, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = rotateByK(arr, k);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def rotateByK(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(*Solution().rotateByK(arr, k))`,
      javascript: `function rotateByK(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(rotateByK(arr, k).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] rotateByK(int[] arr, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = rotateByK(arr, k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. Move Zeros to End
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Move Zeros to End",
    slug: "move-zeros-to-end",
    difficulty: "Easy",
    description:
      "Given an array of N integers, move all 0s to the end of the array while maintaining the relative order of the non-zero elements. Do this in-place.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "N space-separated integers — the array with all zeros moved to the end",
    sampleTestCases: [
      {
        input: "arr = [0, 1, 0, 3, 12]",
        output: "1 3 12 0 0",
        explanation: "Non-zero elements retain their order; zeros go to end.",
      },
      {
        input: "arr = [0, 0, 0, 1]",
        output: "1 0 0 0",
        explanation: "Only 1 is non-zero, it comes first.",
      },
    ],
    testCases: [
      { input: "5\n0 1 0 3 12", output: "1 3 12 0 0", isHidden: false },
      { input: "4\n0 0 0 1", output: "1 0 0 0", isHidden: false },
      { input: "3\n1 2 3", output: "1 2 3", isHidden: true },
      { input: "3\n0 0 0", output: "0 0 0", isHidden: true },
      { input: "6\n4 0 2 0 0 7", output: "4 2 7 0 0 0", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> moveZeros(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = moveZeros(arr);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def moveZeros(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().moveZeros(arr))`,
      javascript: `function moveZeros(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(moveZeros(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] moveZeros(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = moveZeros(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Two Pointers"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. Linear Search
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Linear Search",
    slug: "linear-search",
    difficulty: "Easy",
    description:
      "Given an array of N integers and a target value, return the index of the first occurrence of the target in the array. If the target is not found, return -1.",
    constraints:
      "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9\n-10^9 <= target <= 10^9",
    inputFormat:
      "First line: N and target\nSecond line: N space-separated integers",
    outputFormat:
      "A single integer — the 0-based index of the first occurrence of target, or -1 if not found",
    sampleTestCases: [
      {
        input: "arr = [4, 2, 7, 1, 9], target = 7",
        output: "2",
        explanation: "7 is at index 2.",
      },
      {
        input: "arr = [1, 2, 3], target = 5",
        output: "-1",
        explanation: "5 is not present in the array.",
      },
    ],
    testCases: [
      { input: "5 7\n4 2 7 1 9", output: "2", isHidden: false },
      { input: "3 5\n1 2 3", output: "-1", isHidden: false },
      { input: "4 1\n1 1 1 1", output: "0", isHidden: true },
      { input: "1 42\n42", output: "0", isHidden: true },
      { input: "5 3\n5 4 3 2 1", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int linearSearch(vector<int>& arr, int target) {
    // Write your code here
}

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << linearSearch(arr, target) << endl;
    return 0;
}`,
      python: `class Solution:
    def linearSearch(self, arr, target):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, target = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().linearSearch(arr, target))`,
      javascript: `function linearSearch(arr, target) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const target = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(linearSearch(arr, target));`,
      java: `import java.util.*;

public class Main {
    public static int linearSearch(int[] arr, int target) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(linearSearch(arr, target));
    }
}`,
    },
    tags: ["Array", "Searching"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 9. Union of Two Sorted Arrays
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Union of Two Sorted Arrays",
    slug: "union-two-sorted-arrays",
    difficulty: "Easy",
    description:
      "Given two sorted arrays of sizes M and N, find their union. The union is a sorted array of all distinct elements from both arrays.",
    constraints:
      "1 <= M, N <= 10^5\n-10^9 <= arr1[i], arr2[i] <= 10^9\nBoth arrays are sorted in non-decreasing order.",
    inputFormat:
      "First line: M and N\nSecond line: M space-separated integers (arr1)\nThird line: N space-separated integers (arr2)",
    outputFormat:
      "Space-separated integers — the sorted union of the two arrays",
    sampleTestCases: [
      {
        input: "arr1 = [1, 2, 4, 5, 6], arr2 = [2, 3, 5, 7]",
        output: "1 2 3 4 5 6 7",
        explanation: "Distinct elements from both arrays, sorted.",
      },
      {
        input: "arr1 = [1, 1, 2], arr2 = [2, 3]",
        output: "1 2 3",
        explanation: "Duplicates within arr1 are also removed.",
      },
    ],
    testCases: [
      { input: "5 4\n1 2 4 5 6\n2 3 5 7", output: "1 2 3 4 5 6 7", isHidden: false },
      { input: "3 2\n1 1 2\n2 3", output: "1 2 3", isHidden: false },
      { input: "3 3\n1 2 3\n1 2 3", output: "1 2 3", isHidden: true },
      { input: "2 3\n10 20\n5 15 25", output: "5 10 15 20 25", isHidden: true },
      { input: "1 1\n1\n2", output: "1 2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> unionArrays(vector<int>& arr1, vector<int>& arr2) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<int> arr1(m), arr2(n);
    for (int i = 0; i < m; i++) cin >> arr1[i];
    for (int i = 0; i < n; i++) cin >> arr2[i];
    vector<int> res = unionArrays(arr1, arr2);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def unionArrays(self, arr1, arr2):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    m, n = int(input_data[0]), int(input_data[1])
    arr1 = list(map(int, input_data[2:m+2]))
    arr2 = list(map(int, input_data[m+2:m+n+2]))
    print(*Solution().unionArrays(arr1, arr2))`,
      javascript: `function unionArrays(arr1, arr2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const m = parseInt(input[0]), n = parseInt(input[1]);
const arr1 = input.slice(2, m + 2).map(Number);
const arr2 = input.slice(m + 2, m + n + 2).map(Number);
console.log(unionArrays(arr1, arr2).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] unionArrays(int[] arr1, int[] arr2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[] arr1 = new int[m], arr2 = new int[n];
        for (int i = 0; i < m; i++) arr1[i] = sc.nextInt();
        for (int i = 0; i < n; i++) arr2[i] = sc.nextInt();
        int[] res = unionArrays(arr1, arr2);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Two Pointers", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 10. Find Missing Number
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Find Missing Number",
    slug: "find-missing-number",
    difficulty: "Easy",
    description:
      "Given an array of N-1 distinct integers in the range [1, N], find the one missing number.",
    constraints: "2 <= N <= 10^5\nAll integers in arr are distinct and in range [1, N].",
    inputFormat: "First line: N\nSecond line: N-1 space-separated integers",
    outputFormat: "A single integer — the missing number",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 4, 5], N = 5",
        output: "3",
        explanation: "3 is the missing number in the range [1, 5].",
      },
      {
        input: "arr = [2, 3, 4, 5], N = 5",
        output: "1",
        explanation: "1 is missing.",
      },
    ],
    testCases: [
      { input: "5\n1 2 4 5", output: "3", isHidden: false },
      { input: "5\n2 3 4 5", output: "1", isHidden: false },
      { input: "2\n1", output: "2", isHidden: true },
      { input: "6\n1 2 3 5 6", output: "4", isHidden: true },
      { input: "10\n1 2 3 4 5 6 7 8 9", output: "10", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int missingNumber(vector<int>& arr, int n) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n - 1);
    for (int i = 0; i < n - 1; i++) cin >> arr[i];
    cout << missingNumber(arr, n) << endl;
    return 0;
}`,
      python: `class Solution:
    def missingNumber(self, arr, n):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n]))
    print(Solution().missingNumber(arr, n))`,
      javascript: `function missingNumber(arr, n) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n).map(Number);
console.log(missingNumber(arr, n));`,
      java: `import java.util.*;

public class Main {
    public static int missingNumber(int[] arr, int n) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n - 1];
        for (int i = 0; i < n - 1; i++) arr[i] = sc.nextInt();
        System.out.println(missingNumber(arr, n));
    }
}`,
    },
    tags: ["Array", "Math", "Bit Manipulation"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 11. Maximum Consecutive Ones
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Maximum Consecutive Ones",
    slug: "maximum-consecutive-ones",
    difficulty: "Easy",
    description:
      "Given a binary array (containing only 0s and 1s) of size N, find the maximum number of consecutive 1s in the array.",
    constraints: "1 <= N <= 10^5\narr[i] is either 0 or 1",
    inputFormat: "First line: N\nSecond line: N space-separated integers (0s and 1s)",
    outputFormat: "A single integer — the maximum number of consecutive 1s",
    sampleTestCases: [
      {
        input: "arr = [1, 1, 0, 1, 1, 1]",
        output: "3",
        explanation: "The last three 1s form the longest streak.",
      },
      {
        input: "arr = [0, 0, 0]",
        output: "0",
        explanation: "No 1s present.",
      },
    ],
    testCases: [
      { input: "6\n1 1 0 1 1 1", output: "3", isHidden: false },
      { input: "3\n0 0 0", output: "0", isHidden: false },
      { input: "5\n1 1 1 1 1", output: "5", isHidden: true },
      { input: "5\n0 1 0 1 0", output: "1", isHidden: true },
      { input: "7\n1 0 1 1 0 1 1", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxConsecutiveOnes(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << maxConsecutiveOnes(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxConsecutiveOnes(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().maxConsecutiveOnes(arr))`,
      javascript: `function maxConsecutiveOnes(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(maxConsecutiveOnes(arr));`,
      java: `import java.util.*;

public class Main {
    public static int maxConsecutiveOnes(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(maxConsecutiveOnes(arr));
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 12. Find the Number That Appears Once (Others Appear Twice)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Find the Number That Appears Once",
    slug: "find-number-appears-once",
    difficulty: "Medium",
    description:
      "Given an array of N integers where every element appears exactly twice except for one element which appears exactly once, find that single element. Your solution must run in O(N) time and O(1) extra space.",
    constraints:
      "1 <= N <= 10^5\nN is always odd\n-10^9 <= arr[i] <= 10^9\nEvery element except one appears exactly twice.",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the element that appears only once",
    sampleTestCases: [
      {
        input: "arr = [2, 2, 3, 4, 4]",
        output: "3",
        explanation: "3 appears once; 2 and 4 appear twice.",
      },
      {
        input: "arr = [7]",
        output: "7",
        explanation: "Only one element.",
      },
    ],
    testCases: [
      { input: "5\n2 2 3 4 4", output: "3", isHidden: false },
      { input: "1\n7", output: "7", isHidden: false },
      { input: "7\n1 1 2 2 3 3 9", output: "9", isHidden: true },
      { input: "3\n-1 -1 5", output: "5", isHidden: true },
      { input: "5\n4 3 4 3 7", output: "7", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int singleNumber(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << singleNumber(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def singleNumber(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().singleNumber(arr))`,
      javascript: `function singleNumber(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(singleNumber(arr));`,
      java: `import java.util.*;

public class Main {
    public static int singleNumber(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(singleNumber(arr));
    }
}`,
    },
    tags: ["Array", "Bit Manipulation"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 13. Longest Subarray with Given Sum K (Positives)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Subarray with Given Sum K (Positives)",
    slug: "longest-subarray-sum-k-positives",
    difficulty: "Medium",
    description:
      "Given an array of N positive integers and a target sum K, find the length of the longest contiguous subarray whose sum equals K.",
    constraints:
      "1 <= N <= 10^5\n1 <= arr[i] <= 10^4\n1 <= K <= 10^9",
    inputFormat: "First line: N and K\nSecond line: N space-separated positive integers",
    outputFormat:
      "A single integer — the length of the longest subarray with sum K, or 0 if none exists",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3, 1, 1, 1], K = 3",
        output: "3",
        explanation:
          "Subarrays with sum 3: [1,2] (len 2), [3] (len 1), [1,1,1] (len 3). Max is 3.",
      },
      {
        input: "arr = [1, 2, 3], K = 10",
        output: "0",
        explanation: "No subarray has sum 10.",
      },
    ],
    testCases: [
      { input: "6 3\n1 2 3 1 1 1", output: "3", isHidden: false },
      { input: "3 10\n1 2 3", output: "0", isHidden: false },
      { input: "5 5\n1 2 1 3 2", output: "4", isHidden: true },
      { input: "4 4\n1 1 1 1", output: "4", isHidden: true },
      { input: "1 5\n5", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestSubarrayWithSumK(vector<int>& arr, long long k) {
    // Write your code here
}

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << longestSubarrayWithSumK(arr, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestSubarrayWithSumK(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().longestSubarrayWithSumK(arr, k))`,
      javascript: `function longestSubarrayWithSumK(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(longestSubarrayWithSumK(arr, k));`,
      java: `import java.util.*;

public class Main {
    public static int longestSubarrayWithSumK(int[] arr, long k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long k = sc.nextLong();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(longestSubarrayWithSumK(arr, k));
    }
}`,
    },
    tags: ["Array", "Sliding Window", "HashMap"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 14. Longest Subarray with Sum K (Positives & Negatives)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Subarray with Sum K",
    slug: "longest-subarray-sum-k",
    difficulty: "Medium",
    description:
      "Given an array of N integers (which may include negatives and zeros) and a target K, find the length of the longest contiguous subarray whose sum equals K.",
    constraints:
      "1 <= N <= 10^5\n-10^4 <= arr[i] <= 10^4\n-10^9 <= K <= 10^9",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat:
      "A single integer — the length of the longest subarray with sum K, or 0 if none exists",
    sampleTestCases: [
      {
        input: "arr = [10, 5, 2, 7, 1, -10], K = 15",
        output: "6",
        explanation: "The entire array sums to 15.",
      },
      {
        input: "arr = [-1, 1, 1], K = 2",
        output: "2",
        explanation: "Subarray [1, 1] has sum 2.",
      },
    ],
    testCases: [
      { input: "6 15\n10 5 2 7 1 -10", output: "6", isHidden: false },
      { input: "3 2\n-1 1 1", output: "2", isHidden: false },
      { input: "5 0\n1 -1 1 -1 0", output: "5", isHidden: true },
      { input: "4 3\n1 2 3 -3", output: "4", isHidden: true },
      { input: "3 100\n1 2 3", output: "0", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestSubarrayWithSumK(vector<int>& arr, long long k) {
    // Write your code here
}

int main() {
    int n;
    long long k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << longestSubarrayWithSumK(arr, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestSubarrayWithSumK(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().longestSubarrayWithSumK(arr, k))`,
      javascript: `function longestSubarrayWithSumK(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(longestSubarrayWithSumK(arr, k));`,
      java: `import java.util.*;

public class Main {
    public static int longestSubarrayWithSumK(int[] arr, long k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long k = sc.nextLong();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(longestSubarrayWithSumK(arr, k));
    }
}`,
    },
    tags: ["Array", "HashMap", "Prefix Sum"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 15. Two Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description:
      "Given an array of N integers and a target value, return the 0-based indices of the two numbers that add up to the target. Each input has exactly one solution. You may not use the same element twice. Return the indices in ascending order.",
    constraints:
      "2 <= N <= 10^4\n-10^9 <= arr[i] <= 10^9\n-10^9 <= target <= 10^9\nExactly one valid answer exists.",
    inputFormat: "First line: N and target\nSecond line: N space-separated integers",
    outputFormat: "Two space-separated integers — the indices of the two numbers (in ascending order)",
    sampleTestCases: [
      {
        input: "arr = [2, 7, 11, 15], target = 9",
        output: "0 1",
        explanation: "arr[0] + arr[1] = 2 + 7 = 9.",
      },
      {
        input: "arr = [3, 2, 4], target = 6",
        output: "1 2",
        explanation: "arr[1] + arr[2] = 2 + 4 = 6.",
      },
    ],
    testCases: [
      { input: "4 9\n2 7 11 15", output: "0 1", isHidden: false },
      { input: "3 6\n3 2 4", output: "1 2", isHidden: false },
      { input: "2 6\n3 3", output: "0 1", isHidden: true },
      { input: "5 10\n1 3 5 7 9", output: "1 4", isHidden: true },
      { input: "4 0\n-1 1 -2 2", output: "0 1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& arr, int target) {
    // Write your code here
}

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = twoSum(arr, target);
    cout << res[0] << " " << res[1] << endl;
    return 0;
}`,
      python: `class Solution:
    def twoSum(self, arr, target):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, target = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    res = Solution().twoSum(arr, target)
    print(res[0], res[1])`,
      javascript: `function twoSum(arr, target) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const target = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
const res = twoSum(arr, target);
console.log(res[0] + ' ' + res[1]);`,
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] arr, int target) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = twoSum(arr, target);
        System.out.println(res[0] + " " + res[1]);
    }
}`,
    },
    tags: ["Array", "HashMap", "Two Pointers"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 16. Sort an Array of 0s, 1s and 2s (Dutch National Flag)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Sort an Array of 0s, 1s and 2s",
    slug: "sort-0s-1s-2s",
    difficulty: "Medium",
    description:
      "Given an array containing only 0s, 1s, and 2s, sort the array in-place so that all 0s come first, then 1s, then 2s. You must solve this in a single pass using O(1) extra space (Dutch National Flag algorithm).",
    constraints: "1 <= N <= 10^5\narr[i] is 0, 1, or 2",
    inputFormat: "First line: N\nSecond line: N space-separated integers (0s, 1s, 2s)",
    outputFormat: "N space-separated integers — the sorted array",
    sampleTestCases: [
      {
        input: "arr = [2, 0, 2, 1, 1, 0]",
        output: "0 0 1 1 2 2",
        explanation: "Dutch National Flag: 0s, then 1s, then 2s.",
      },
      {
        input: "arr = [0]",
        output: "0",
        explanation: "Single element, already sorted.",
      },
    ],
    testCases: [
      { input: "6\n2 0 2 1 1 0", output: "0 0 1 1 2 2", isHidden: false },
      { input: "1\n0", output: "0", isHidden: false },
      { input: "4\n2 2 2 2", output: "2 2 2 2", isHidden: true },
      { input: "5\n0 0 0 1 2", output: "0 0 0 1 2", isHidden: true },
      { input: "6\n1 0 2 1 0 2", output: "0 0 1 1 2 2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> sortColors(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = sortColors(arr);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def sortColors(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().sortColors(arr))`,
      javascript: `function sortColors(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(sortColors(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] sortColors(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = sortColors(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Two Pointers", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 17. Majority Element I (> N/2 times)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Majority Element I",
    slug: "majority-element-i",
    difficulty: "Easy",
    description:
      "Given an array of N integers, find the element that appears more than N/2 times. It is guaranteed that such an element always exists. Solve in O(N) time and O(1) space using Boyer-Moore Voting Algorithm.",
    constraints:
      "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9\nA majority element always exists.",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the majority element",
    sampleTestCases: [
      {
        input: "arr = [3, 2, 3]",
        output: "3",
        explanation: "3 appears 2 times out of 3 (> N/2 = 1.5).",
      },
      {
        input: "arr = [2, 2, 1, 1, 2]",
        output: "2",
        explanation: "2 appears 3 times out of 5 (> N/2 = 2.5).",
      },
    ],
    testCases: [
      { input: "3\n3 2 3", output: "3", isHidden: false },
      { input: "5\n2 2 1 1 2", output: "2", isHidden: false },
      { input: "1\n9", output: "9", isHidden: true },
      { input: "5\n1 1 1 2 1", output: "1", isHidden: true },
      { input: "7\n4 4 4 4 1 2 3", output: "4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int majorityElement(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << majorityElement(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def majorityElement(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().majorityElement(arr))`,
      javascript: `function majorityElement(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(majorityElement(arr));`,
      java: `import java.util.*;

public class Main {
    public static int majorityElement(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(majorityElement(arr));
    }
}`,
    },
    tags: ["Array", "Boyer-Moore Voting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 18. Kadane's Algorithm — Maximum Subarray Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Maximum Subarray Sum — Kadane's Algorithm",
    slug: "maximum-subarray-sum-kadane",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    constraints: "1 <= N <= 10^5\n-10^4 <= arr[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum subarray sum",
    sampleTestCases: [
      {
        input: "arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "Subarray [4, -1, 2, 1] has the maximum sum 6.",
      },
      {
        input: "arr = [-1, -2, -3]",
        output: "-1",
        explanation: "All negative — best is the single element -1.",
      },
    ],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", isHidden: false },
      { input: "3\n-1 -2 -3", output: "-1", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "5\n1 2 3 4 5", output: "15", isHidden: true },
      { input: "6\n3 -1 2 -1 2 -2", output: "5", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long maxSubarraySum(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << maxSubarraySum(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxSubarraySum(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().maxSubarraySum(arr))`,
      javascript: `function maxSubarraySum(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(maxSubarraySum(arr));`,
      java: `import java.util.*;

public class Main {
    public static long maxSubarraySum(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(maxSubarraySum(arr));
    }
}`,
    },
    tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 19. Print Subarray with Maximum Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Print Subarray with Maximum Sum",
    slug: "print-subarray-maximum-sum",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find the contiguous subarray with the largest sum and print the subarray itself. If multiple subarrays have the same maximum sum, print the one that appears first (leftmost start, then shortest if tied).",
    constraints: "1 <= N <= 10^5\n-10^4 <= arr[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "Space-separated integers — the elements of the maximum sum subarray",
    sampleTestCases: [
      {
        input: "arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "4 -1 2 1",
        explanation: "Subarray [4, -1, 2, 1] has the maximum sum 6.",
      },
      {
        input: "arr = [1, 2, 3]",
        output: "1 2 3",
        explanation: "The entire array has the maximum sum 6.",
      },
    ],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "4 -1 2 1", isHidden: false },
      { input: "3\n1 2 3", output: "1 2 3", isHidden: false },
      { input: "3\n-1 -2 -3", output: "-1", isHidden: true },
      { input: "5\n2 -1 2 3 -1", output: "2 -1 2 3", isHidden: true },
      { input: "1\n7", output: "7", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> maxSumSubarray(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = maxSumSubarray(arr);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def maxSumSubarray(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().maxSumSubarray(arr))`,
      javascript: `function maxSumSubarray(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(maxSumSubarray(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] maxSumSubarray(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = maxSumSubarray(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 20. Stock Buy and Sell
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Stock Buy and Sell",
    slug: "stock-buy-and-sell",
    difficulty: "Medium",
    description:
      "Given an array of N integers where prices[i] is the price of a stock on day i, find the maximum profit you can achieve by buying on one day and selling on a later day. If no profit is possible, return 0.",
    constraints: "1 <= N <= 10^5\n0 <= prices[i] <= 10^4",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum profit",
    sampleTestCases: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 2 (price 1), sell on day 5 (price 6). Profit = 5.",
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
      { input: "5\n3 3 3 3 3", output: "0", isHidden: true },
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
    tags: ["Array", "Greedy"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 21. Rearrange Array Elements by Sign
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Rearrange Array Elements by Sign",
    slug: "rearrange-array-by-sign",
    difficulty: "Medium",
    description:
      "Given an array of N integers with equal number of positive and negative numbers, rearrange the elements alternately: positive at even indices (0, 2, 4, ...) and negative at odd indices (1, 3, 5, ...). Maintain the relative order of positives and negatives.",
    constraints:
      "2 <= N <= 10^5\nN is even\nN/2 positive and N/2 negative numbers\n-10^9 <= arr[i] <= 10^9\narr[i] != 0",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "N space-separated integers — the rearranged array",
    sampleTestCases: [
      {
        input: "arr = [3, 1, -2, -5, 2, -4]",
        output: "3 -2 1 -5 2 -4",
        explanation: "Positives at even indices, negatives at odd indices.",
      },
      {
        input: "arr = [-1, 1]",
        output: "1 -1",
        explanation: "1 at index 0, -1 at index 1.",
      },
    ],
    testCases: [
      { input: "6\n3 1 -2 -5 2 -4", output: "3 -2 1 -5 2 -4", isHidden: false },
      { input: "2\n-1 1", output: "1 -1", isHidden: false },
      { input: "4\n1 2 -1 -2", output: "1 -1 2 -2", isHidden: true },
      { input: "6\n-3 -1 -2 4 5 6", output: "4 -3 5 -1 6 -2", isHidden: true },
      { input: "4\n10 20 -10 -20", output: "10 -10 20 -20", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> rearrangeBySign(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = rearrangeBySign(arr);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def rearrangeBySign(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().rearrangeBySign(arr))`,
      javascript: `function rearrangeBySign(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(rearrangeBySign(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] rearrangeBySign(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = rearrangeBySign(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Two Pointers"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 22. Next Permutation
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Next Permutation",
    slug: "next-permutation",
    difficulty: "Medium",
    description:
      "Given an array of N integers representing a permutation, rearrange the array into the lexicographically next greater permutation. If no such permutation exists (the array is in descending order), rearrange to the smallest permutation (ascending order). The transformation must be done in-place.",
    constraints:
      "1 <= N <= 100\n0 <= arr[i] <= 100",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "N space-separated integers — the next permutation",
    sampleTestCases: [
      {
        input: "arr = [1, 2, 3]",
        output: "1 3 2",
        explanation: "The next permutation of [1, 2, 3] is [1, 3, 2].",
      },
      {
        input: "arr = [3, 2, 1]",
        output: "1 2 3",
        explanation: "Already largest permutation; wraps to smallest.",
      },
    ],
    testCases: [
      { input: "3\n1 2 3", output: "1 3 2", isHidden: false },
      { input: "3\n3 2 1", output: "1 2 3", isHidden: false },
      { input: "3\n1 1 5", output: "1 5 1", isHidden: true },
      { input: "1\n1", output: "1", isHidden: true },
      { input: "4\n2 1 4 3", output: "2 3 1 4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> nextPermutation(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = nextPermutation(arr);
    for (int i = 0; i < n; i++) cout << res[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def nextPermutation(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().nextPermutation(arr))`,
      javascript: `function nextPermutation(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(nextPermutation(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] nextPermutation(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = nextPermutation(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(res[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Math"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 23. Leaders in an Array
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Leaders in an Array",
    slug: "leaders-in-array",
    difficulty: "Medium",
    description:
      "An element is a leader if it is strictly greater than all the elements to its right. The rightmost element is always a leader. Given an array of N integers, return all leaders in the order they appear in the array.",
    constraints: "1 <= N <= 10^6\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "Space-separated integers — the leaders in left-to-right order",
    sampleTestCases: [
      {
        input: "arr = [16, 17, 4, 3, 5, 2]",
        output: "17 5 2",
        explanation: "17 > [4,3,5,2]; 5 > [2]; 2 is the last element.",
      },
      {
        input: "arr = [1, 2, 3, 4, 5]",
        output: "5",
        explanation: "Only the last element qualifies as a leader.",
      },
    ],
    testCases: [
      { input: "6\n16 17 4 3 5 2", output: "17 5 2", isHidden: false },
      { input: "5\n1 2 3 4 5", output: "5", isHidden: false },
      { input: "5\n5 4 3 2 1", output: "5 4 3 2 1", isHidden: true },
      { input: "1\n10", output: "10", isHidden: true },
      { input: "4\n7 7 7 7", output: "7", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> leaders(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = leaders(arr);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def leaders(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(*Solution().leaders(arr))`,
      javascript: `function leaders(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(leaders(arr).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] leaders(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = leaders(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 24. Longest Consecutive Sequence
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Longest Consecutive Sequence in an Array",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    description:
      "Given an unsorted array of N integers, find the length of the longest sequence of consecutive integers. Your algorithm must run in O(N) time.",
    constraints: "1 <= N <= 10^5\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the length of the longest consecutive sequence",
    sampleTestCases: [
      {
        input: "arr = [100, 4, 200, 1, 3, 2]",
        output: "4",
        explanation: "The sequence [1, 2, 3, 4] has length 4.",
      },
      {
        input: "arr = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        output: "9",
        explanation: "The sequence [0, 1, 2, 3, 4, 5, 6, 7, 8] has length 9.",
      },
    ],
    testCases: [
      { input: "6\n100 4 200 1 3 2", output: "4", isHidden: false },
      { input: "10\n0 3 7 2 5 8 4 6 0 1", output: "9", isHidden: false },
      { input: "1\n1", output: "1", isHidden: true },
      { input: "5\n5 5 5 5 5", output: "1", isHidden: true },
      { input: "4\n10 5 6 7", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int longestConsecutive(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << longestConsecutive(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def longestConsecutive(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().longestConsecutive(arr))`,
      javascript: `function longestConsecutive(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(longestConsecutive(arr));`,
      java: `import java.util.*;

public class Main {
    public static int longestConsecutive(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(longestConsecutive(arr));
    }
}`,
    },
    tags: ["Array", "HashSet"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 25. Set Matrix Zeroes
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: "Medium",
    description:
      "Given an M x N integer matrix, if any element is 0, set its entire row and column to 0. Do this in-place. Try to solve it with O(1) extra space.",
    constraints: "1 <= M, N <= 200\n-2^31 <= matrix[i][j] <= 2^31 - 1",
    inputFormat:
      "First line: M and N\nNext M lines: N space-separated integers each",
    outputFormat:
      "M lines, each with N space-separated integers — the modified matrix",
    sampleTestCases: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "1 0 1\n0 0 0\n1 0 1",
        explanation:
          "Element at [1][1] is 0; entire row 1 and column 1 become 0.",
      },
      {
        input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        output: "0 0 0 0\n0 4 5 0\n0 3 1 0",
        explanation: "Row 0 has zeros at columns 0 and 3.",
      },
    ],
    testCases: [
      { input: "3 3\n1 1 1\n1 0 1\n1 1 1", output: "1 0 1\n0 0 0\n1 0 1", isHidden: false },
      { input: "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5", output: "0 0 0 0\n0 4 5 0\n0 3 1 0", isHidden: false },
      { input: "1 1\n0", output: "0", isHidden: true },
      { input: "2 2\n1 1\n1 1", output: "1 1\n1 1", isHidden: true },
      { input: "2 3\n1 0 3\n4 5 6", output: "0 0 0\n4 0 6", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> setZeroes(vector<vector<int>>& matrix) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) cin >> matrix[i][j];
    vector<vector<int>> res = setZeroes(matrix);
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) cout << res[i][j] << " \\n"[j == n - 1];
    }
    return 0;
}`,
      python: `class Solution:
    def setZeroes(self, matrix):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    m, n = int(input_data[idx]), int(input_data[idx+1]); idx += 2
    matrix = []
    for i in range(m):
        row = list(map(int, input_data[idx:idx+n])); idx += n
        matrix.append(row)
    res = Solution().setZeroes(matrix)
    for row in res:
        print(*row)`,
      javascript: `function setZeroes(matrix) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const m = parseInt(input[idx++]), n = parseInt(input[idx++]);
const matrix = [];
for (let i = 0; i < m; i++) {
    matrix.push(input.slice(idx, idx + n).map(Number));
    idx += n;
}
const res = setZeroes(matrix);
res.forEach(row => console.log(row.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static int[][] setZeroes(int[][] matrix) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();
        int[][] res = setZeroes(matrix);
        for (int i = 0; i < m; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) sb.append(res[i][j]).append(j < n - 1 ? " " : "");
            System.out.println(sb);
        }
    }
}`,
    },
    tags: ["Array", "Matrix"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 26. Rotate Matrix by 90 Degrees
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Rotate Matrix by 90 Degrees",
    slug: "rotate-matrix-90-degrees",
    difficulty: "Medium",
    description:
      "Given an N x N matrix, rotate it 90 degrees clockwise in-place.",
    constraints: "1 <= N <= 50\n-1000 <= matrix[i][j] <= 1000",
    inputFormat:
      "First line: N\nNext N lines: N space-separated integers each",
    outputFormat: "N lines, each with N space-separated integers — the rotated matrix",
    sampleTestCases: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "7 4 1\n8 5 2\n9 6 3",
        explanation: "Rotating 90° clockwise maps column 0 bottom-to-top to row 0.",
      },
      {
        input: "matrix = [[5,1],[1,5]]",
        output: "1 5\n5 1",
      },
    ],
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", isHidden: false },
      { input: "2\n5 1\n1 5", output: "1 5\n5 1", isHidden: false },
      { input: "1\n42", output: "42", isHidden: true },
      { input: "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", output: "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> rotateMatrix(vector<vector<int>>& matrix) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> matrix[i][j];
    vector<vector<int>> res = rotateMatrix(matrix);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) cout << res[i][j] << " \\n"[j == n - 1];
    }
    return 0;
}`,
      python: `class Solution:
    def rotateMatrix(self, matrix):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    n = int(input_data[idx]); idx += 1
    matrix = []
    for i in range(n):
        row = list(map(int, input_data[idx:idx+n])); idx += n
        matrix.append(row)
    res = Solution().rotateMatrix(matrix)
    for row in res:
        print(*row)`,
      javascript: `function rotateMatrix(matrix) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const n = parseInt(input[idx++]);
const matrix = [];
for (let i = 0; i < n; i++) {
    matrix.push(input.slice(idx, idx + n).map(Number));
    idx += n;
}
const res = rotateMatrix(matrix);
res.forEach(row => console.log(row.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static int[][] rotateMatrix(int[][] matrix) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();
        int[][] res = rotateMatrix(matrix);
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) sb.append(res[i][j]).append(j < n - 1 ? " " : "");
            System.out.println(sb);
        }
    }
}`,
    },
    tags: ["Array", "Matrix", "Math"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 27. Spiral Matrix
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Print the Matrix in Spiral Order",
    slug: "spiral-matrix",
    difficulty: "Medium",
    description:
      "Given an M x N matrix, return all elements of the matrix in spiral order (clockwise, starting from the top-left).",
    constraints: "1 <= M, N <= 100\n-100 <= matrix[i][j] <= 100",
    inputFormat:
      "First line: M and N\nNext M lines: N space-separated integers each",
    outputFormat:
      "Space-separated integers — elements in spiral order",
    sampleTestCases: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "1 2 3 6 9 8 7 4 5",
        explanation: "Spiral: top row → right col → bottom row → left col → inner.",
      },
      {
        input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        output: "1 2 3 4 8 12 11 10 9 5 6 7",
      },
    ],
    testCases: [
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "1 2 3 6 9 8 7 4 5", isHidden: false },
      { input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", output: "1 2 3 4 8 12 11 10 9 5 6 7", isHidden: false },
      { input: "1 4\n1 2 3 4", output: "1 2 3 4", isHidden: true },
      { input: "4 1\n1\n2\n3\n4", output: "1 2 3 4", isHidden: true },
      { input: "1 1\n9", output: "9", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<vector<int>> matrix(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) cin >> matrix[i][j];
    vector<int> res = spiralOrder(matrix);
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    return 0;
}`,
      python: `class Solution:
    def spiralOrder(self, matrix):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    idx = 0
    m, n = int(input_data[idx]), int(input_data[idx+1]); idx += 2
    matrix = []
    for i in range(m):
        row = list(map(int, input_data[idx:idx+n])); idx += n
        matrix.append(row)
    print(*Solution().spiralOrder(matrix))`,
      javascript: `function spiralOrder(matrix) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
let idx = 0;
const m = parseInt(input[idx++]), n = parseInt(input[idx++]);
const matrix = [];
for (let i = 0; i < m; i++) {
    matrix.push(input.slice(idx, idx + n).map(Number));
    idx += n;
}
console.log(spiralOrder(matrix).join(' '));`,
      java: `import java.util.*;

public class Main {
    public static int[] spiralOrder(int[][] matrix) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[][] matrix = new int[m][n];
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) matrix[i][j] = sc.nextInt();
        int[] res = spiralOrder(matrix);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.length; i++) sb.append(res[i]).append(i < res.length - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Matrix", "Simulation"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 28. Count Subarrays with Given Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Count Subarrays with Given Sum",
    slug: "count-subarrays-given-sum",
    difficulty: "Medium",
    description:
      "Given an array of N integers and a target K, count the total number of contiguous subarrays whose sum equals K.",
    constraints:
      "1 <= N <= 2 * 10^4\n-1000 <= arr[i] <= 1000\n-10^7 <= K <= 10^7",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the count of subarrays with sum K",
    sampleTestCases: [
      {
        input: "arr = [1, 1, 1], K = 2",
        output: "2",
        explanation: "Subarrays: [1,1] starting at index 0, [1,1] starting at index 1.",
      },
      {
        input: "arr = [1, 2, 3], K = 3",
        output: "2",
        explanation: "Subarrays [1,2] and [3] both sum to 3.",
      },
    ],
    testCases: [
      { input: "3 2\n1 1 1", output: "2", isHidden: false },
      { input: "3 3\n1 2 3", output: "2", isHidden: false },
      { input: "5 0\n0 0 0 0 0", output: "15", isHidden: true },
      { input: "4 5\n1 2 3 -1", output: "2", isHidden: true },
      { input: "1 1\n1", output: "1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int subarraySum(vector<int>& arr, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << subarraySum(arr, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def subarraySum(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().subarraySum(arr, k))`,
      javascript: `function subarraySum(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(subarraySum(arr, k));`,
      java: `import java.util.*;

public class Main {
    public static int subarraySum(int[] arr, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(subarraySum(arr, k));
    }
}`,
    },
    tags: ["Array", "HashMap", "Prefix Sum"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 29. Pascal's Triangle I
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Pascal's Triangle",
    slug: "pascals-triangle",
    difficulty: "Easy",
    description:
      "Given an integer numRows, return the first numRows rows of Pascal's Triangle. In Pascal's Triangle, each number is the sum of the two directly above it.",
    constraints: "1 <= numRows <= 30",
    inputFormat: "A single integer — numRows",
    outputFormat:
      "numRows lines; the i-th line contains i space-separated integers (the i-th row of Pascal's triangle)",
    sampleTestCases: [
      {
        input: "numRows = 5",
        output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1",
        explanation: "The first 5 rows of Pascal's Triangle.",
      },
      {
        input: "numRows = 1",
        output: "1",
      },
    ],
    testCases: [
      { input: "5", output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1", isHidden: false },
      { input: "1", output: "1", isHidden: false },
      { input: "3", output: "1\n1 1\n1 2 1", isHidden: true },
      { input: "6", output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> pascalsTriangle(int numRows) {
    // Write your code here
}

int main() {
    int numRows;
    if (!(cin >> numRows)) return 0;
    vector<vector<int>> res = pascalsTriangle(numRows);
    for (auto& row : res) {
        for (int i = 0; i < (int)row.size(); i++) cout << row[i] << " \\n"[i == (int)row.size() - 1];
    }
    return 0;
}`,
      python: `class Solution:
    def pascalsTriangle(self, numRows):
        pass

if __name__ == '__main__':
    import sys
    numRows = int(sys.stdin.read().strip())
    for row in Solution().pascalsTriangle(numRows):
        print(*row)`,
      javascript: `function pascalsTriangle(numRows) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const numRows = parseInt(fs.readFileSync(0, 'utf8').trim());
pascalsTriangle(numRows).forEach(row => console.log(row.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static List<List<Integer>> pascalsTriangle(int numRows) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int numRows = sc.nextInt();
        List<List<Integer>> res = pascalsTriangle(numRows);
        for (List<Integer> row : res) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < row.size(); i++) sb.append(row.get(i)).append(i < row.size() - 1 ? " " : "");
            System.out.println(sb);
        }
    }
}`,
    },
    tags: ["Array", "Math", "Dynamic Programming"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 30. Majority Element II (> N/3 times)
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Majority Element II",
    slug: "majority-element-ii",
    difficulty: "Hard",
    description:
      "Given an array of N integers, find all elements that appear more than N/3 times. Return the result in sorted order. There can be at most two such elements. Your solution must run in O(N) time and O(1) extra space.",
    constraints: "1 <= N <= 5 * 10^4\n-10^9 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "Space-separated integers — the majority elements in sorted order (may be 0, 1, or 2 elements)",
    sampleTestCases: [
      {
        input: "arr = [3, 2, 3]",
        output: "3",
        explanation: "3 appears 2 times > 3/3 = 1.",
      },
      {
        input: "arr = [1, 1, 1, 3, 3, 2, 2, 2]",
        output: "1 2",
        explanation: "1 appears 3 times, 2 appears 3 times, both > 8/3 ≈ 2.67.",
      },
    ],
    testCases: [
      { input: "3\n3 2 3", output: "3", isHidden: false },
      { input: "8\n1 1 1 3 3 2 2 2", output: "1 2", isHidden: false },
      { input: "1\n5", output: "5", isHidden: true },
      { input: "9\n1 1 1 3 2 2 3 3 3", output: "1 3", isHidden: true },
      { input: "5\n2 2 2 2 2", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> majorityElementII(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<int> res = majorityElementII(arr);
    sort(res.begin(), res.end());
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << " \\n"[i == (int)res.size() - 1];
    if (res.empty()) cout << endl;
    return 0;
}`,
      python: `class Solution:
    def majorityElementII(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    res = sorted(Solution().majorityElementII(arr))
    print(*res)`,
      javascript: `function majorityElementII(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
const res = majorityElementII(arr).sort((a, b) => a - b);
console.log(res.join(' '));`,
      java: `import java.util.*;

public class Main {
    public static List<Integer> majorityElementII(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        List<Integer> res = majorityElementII(arr);
        Collections.sort(res);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) sb.append(res.get(i)).append(i < res.size() - 1 ? " " : "");
        System.out.println(sb);
    }
}`,
    },
    tags: ["Array", "Boyer-Moore Voting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 31. 3Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "3 Sum",
    slug: "three-sum",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find all unique triplets [a, b, c] such that a + b + c = 0. No two triplets should be duplicates. Return triplets sorted in non-decreasing order.",
    constraints:
      "3 <= N <= 3000\n-10^5 <= arr[i] <= 10^5",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "Each line contains 3 space-separated integers forming a valid triplet. Print triplets in lexicographically sorted order. If no triplet exists, print -1.",
    sampleTestCases: [
      {
        input: "arr = [-1, 0, 1, 2, -1, -4]",
        output: "-1 -1 2\n-1 0 1",
        explanation: "Unique triplets that sum to 0.",
      },
      {
        input: "arr = [0, 1, 1]",
        output: "-1",
        explanation: "No triplet sums to 0.",
      },
    ],
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1", isHidden: false },
      { input: "3\n0 1 1", output: "-1", isHidden: false },
      { input: "3\n0 0 0", output: "0 0 0", isHidden: true },
      { input: "4\n-2 0 1 1", output: "-2 1 1", isHidden: true },
      { input: "5\n-4 -1 -1 0 1", output: "-4 -1 -1\n-1 -1 2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> threeSum(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<vector<int>> res = threeSum(arr);
    if (res.empty()) { cout << -1 << endl; return 0; }
    for (auto& t : res) cout << t[0] << " " << t[1] << " " << t[2] << "\\n";
    return 0;
}`,
      python: `class Solution:
    def threeSum(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    res = Solution().threeSum(arr)
    if not res:
        print(-1)
    else:
        for t in res:
            print(*t)`,
      javascript: `function threeSum(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
const res = threeSum(arr);
if (!res.length) console.log(-1);
else res.forEach(t => console.log(t.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static List<List<Integer>> threeSum(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        List<List<Integer>> res = threeSum(arr);
        if (res.isEmpty()) { System.out.println(-1); return; }
        for (List<Integer> t : res) System.out.println(t.get(0) + " " + t.get(1) + " " + t.get(2));
    }
}`,
    },
    tags: ["Array", "Two Pointers", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 32. 4Sum
  // ─────────────────────────────────────────────────────────────────
  {
    title: "4 Sum",
    slug: "four-sum",
    difficulty: "Medium",
    description:
      "Given an array of N integers and a target T, find all unique quadruplets [a, b, c, d] such that a + b + c + d = T. Return quadruplets in sorted order with no duplicates.",
    constraints:
      "4 <= N <= 200\n-10^9 <= arr[i] <= 10^9\n-10^9 <= T <= 10^9",
    inputFormat: "First line: N and T\nSecond line: N space-separated integers",
    outputFormat:
      "Each line contains 4 space-separated integers forming a valid quadruplet (sorted per line). Print quadruplets in lexicographic order. If none exist, print -1.",
    sampleTestCases: [
      {
        input: "arr = [1, 0, -1, 0, -2, 2], T = 0",
        output: "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1",
        explanation: "Three unique quadruplets sum to 0.",
      },
      {
        input: "arr = [2, 2, 2, 2, 2], T = 8",
        output: "2 2 2 2",
        explanation: "Only one unique quadruplet.",
      },
    ],
    testCases: [
      { input: "6 0\n1 0 -1 0 -2 2", output: "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1", isHidden: false },
      { input: "5 8\n2 2 2 2 2", output: "2 2 2 2", isHidden: false },
      { input: "4 100\n1 2 3 4", output: "-1", isHidden: true },
      { input: "5 0\n0 0 0 0 0", output: "0 0 0 0", isHidden: true },
      { input: "6 0\n-3 -2 -1 0 0 1", output: "-3 -2 1 4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> fourSum(vector<int>& arr, long long target) {
    // Write your code here
}

int main() {
    int n;
    long long target;
    if (!(cin >> n >> target)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    vector<vector<int>> res = fourSum(arr, target);
    if (res.empty()) { cout << -1 << endl; return 0; }
    for (auto& q : res) cout << q[0] << " " << q[1] << " " << q[2] << " " << q[3] << "\\n";
    return 0;
}`,
      python: `class Solution:
    def fourSum(self, arr, target):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, target = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    res = Solution().fourSum(arr, target)
    if not res:
        print(-1)
    else:
        for q in res:
            print(*q)`,
      javascript: `function fourSum(arr, target) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const target = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
const res = fourSum(arr, target);
if (!res.length) console.log(-1);
else res.forEach(q => console.log(q.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static List<List<Integer>> fourSum(int[] arr, long target) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); long target = sc.nextLong();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        List<List<Integer>> res = fourSum(arr, target);
        if (res.isEmpty()) { System.out.println(-1); return; }
        for (List<Integer> q : res) System.out.println(q.get(0) + " " + q.get(1) + " " + q.get(2) + " " + q.get(3));
    }
}`,
    },
    tags: ["Array", "Two Pointers", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 33. Largest Subarray with Sum 0
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Largest Subarray with Sum 0",
    slug: "largest-subarray-sum-zero",
    difficulty: "Medium",
    description:
      "Given an array of N integers (may contain negatives), find the length of the longest subarray whose sum equals 0.",
    constraints:
      "1 <= N <= 10^5\n-1000 <= arr[i] <= 1000",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat:
      "A single integer — the length of the longest zero-sum subarray, or 0 if none exists",
    sampleTestCases: [
      {
        input: "arr = [15, -2, 2, -8, 1, 7, 10, 23]",
        output: "5",
        explanation: "Subarray [-2, 2, -8, 1, 7] (index 1 to 5) sums to 0.",
      },
      {
        input: "arr = [1, 2, 3]",
        output: "0",
        explanation: "No subarray with sum 0 exists.",
      },
    ],
    testCases: [
      { input: "8\n15 -2 2 -8 1 7 10 23", output: "5", isHidden: false },
      { input: "3\n1 2 3", output: "0", isHidden: false },
      { input: "5\n0 0 0 0 0", output: "5", isHidden: true },
      { input: "4\n1 -1 2 -2", output: "4", isHidden: true },
      { input: "3\n-1 1 0", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int largestSubarraySumZero(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << largestSubarraySumZero(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def largestSubarraySumZero(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().largestSubarraySumZero(arr))`,
      javascript: `function largestSubarraySumZero(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(largestSubarraySumZero(arr));`,
      java: `import java.util.*;

public class Main {
    public static int largestSubarraySumZero(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(largestSubarraySumZero(arr));
    }
}`,
    },
    tags: ["Array", "HashMap", "Prefix Sum"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 34. Count Subarrays with XOR = K
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Count Subarrays with XOR K",
    slug: "count-subarrays-xor-k",
    difficulty: "Hard",
    description:
      "Given an array of N integers and an integer K, count the number of subarrays whose XOR equals K.",
    constraints:
      "1 <= N <= 10^5\n1 <= arr[i] <= 10^9\n1 <= K <= 10^9",
    inputFormat: "First line: N and K\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the count of subarrays with XOR equal to K",
    sampleTestCases: [
      {
        input: "arr = [4, 2, 2, 6, 4], K = 6",
        output: "4",
        explanation: "Subarrays with XOR 6: [4,2], [4,2,2,6,4], [2,2,6,4] and [6]. (indices vary)",
      },
      {
        input: "arr = [5, 6, 7, 8, 9], K = 5",
        output: "2",
      },
    ],
    testCases: [
      { input: "5 6\n4 2 2 6 4", output: "4", isHidden: false },
      { input: "5 5\n5 6 7 8 9", output: "2", isHidden: false },
      { input: "3 2\n2 2 2", output: "2", isHidden: true },
      { input: "1 5\n5", output: "1", isHidden: true },
      { input: "4 0\n1 1 2 2", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int countSubarraysWithXorK(vector<int>& arr, int k) {
    // Write your code here
}

int main() {
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << countSubarraysWithXorK(arr, k) << endl;
    return 0;
}`,
      python: `class Solution:
    def countSubarraysWithXorK(self, arr, k):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n, k = int(input_data[0]), int(input_data[1])
    arr = list(map(int, input_data[2:n+2]))
    print(Solution().countSubarraysWithXorK(arr, k))`,
      javascript: `function countSubarraysWithXorK(arr, k) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const k = parseInt(input[1]);
const arr = input.slice(2, n + 2).map(Number);
console.log(countSubarraysWithXorK(arr, k));`,
      java: `import java.util.*;

public class Main {
    public static int countSubarraysWithXorK(int[] arr, int k) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countSubarraysWithXorK(arr, k));
    }
}`,
    },
    tags: ["Array", "Bit Manipulation", "HashMap", "Prefix Sum"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 35. Merge Overlapping Subintervals
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Merge Overlapping Subintervals",
    slug: "merge-overlapping-intervals",
    difficulty: "Medium",
    description:
      "Given a list of N intervals [start, end], merge all overlapping intervals and return the resulting list of non-overlapping intervals sorted by start time.",
    constraints:
      "1 <= N <= 10^4\n0 <= start[i] <= end[i] <= 10^4",
    inputFormat:
      "First line: N\nNext N lines: two space-separated integers start and end for each interval",
    outputFormat:
      "Each line contains two space-separated integers — the start and end of a merged interval",
    sampleTestCases: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "1 6\n8 10\n15 18",
        explanation: "[1,3] and [2,6] overlap and merge into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "1 5",
        explanation: "Touching intervals are merged.",
      },
    ],
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18", isHidden: false },
      { input: "2\n1 4\n4 5", output: "1 5", isHidden: false },
      { input: "1\n5 7", output: "5 7", isHidden: true },
      { input: "3\n1 4\n2 3\n3 5", output: "1 5", isHidden: true },
      { input: "3\n1 2\n3 4\n5 6", output: "1 2\n3 4\n5 6", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<int>> intervals(n, vector<int>(2));
    for (int i = 0; i < n; i++) cin >> intervals[i][0] >> intervals[i][1];
    vector<vector<int>> res = mergeIntervals(intervals);
    for (auto& iv : res) cout << iv[0] << " " << iv[1] << "\\n";
    return 0;
}`,
      python: `class Solution:
    def mergeIntervals(self, intervals):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    intervals = []
    for i in range(n):
        intervals.append([int(input_data[1 + 2*i]), int(input_data[2 + 2*i])])
    for iv in Solution().mergeIntervals(intervals):
        print(*iv)`,
      javascript: `function mergeIntervals(intervals) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const intervals = [];
for (let i = 0; i < n; i++) intervals.push([parseInt(input[1 + 2*i]), parseInt(input[2 + 2*i])]);
mergeIntervals(intervals).forEach(iv => console.log(iv.join(' ')));`,
      java: `import java.util.*;

public class Main {
    public static int[][] mergeIntervals(int[][] intervals) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) { intervals[i][0] = sc.nextInt(); intervals[i][1] = sc.nextInt(); }
        int[][] res = mergeIntervals(intervals);
        for (int[] iv : res) System.out.println(iv[0] + " " + iv[1]);
    }
}`,
    },
    tags: ["Array", "Sorting", "Intervals"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 36. Merge Two Sorted Arrays Without Extra Space
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Merge Two Sorted Arrays Without Extra Space",
    slug: "merge-two-sorted-arrays-no-space",
    difficulty: "Medium",
    description:
      "Given two sorted arrays arr1 of size M and arr2 of size N, merge them in-place such that arr1 contains the M smallest elements and arr2 contains the N largest elements, both in sorted order. Use O(1) extra space.",
    constraints:
      "1 <= M, N <= 10^5\n0 <= arr1[i], arr2[i] <= 10^7\nBoth arrays are sorted in non-decreasing order.",
    inputFormat:
      "First line: M and N\nSecond line: M space-separated integers (arr1)\nThird line: N space-separated integers (arr2)",
    outputFormat: "First line: M sorted elements of arr1\nSecond line: N sorted elements of arr2",
    sampleTestCases: [
      {
        input: "arr1 = [1, 3, 5, 7], arr2 = [0, 2, 6, 8, 9]",
        output: "0 1 2 3\n5 6 7 8 9",
        explanation: "The 4 smallest elements go into arr1, the rest into arr2.",
      },
      {
        input: "arr1 = [1], arr2 = [2, 3]",
        output: "1\n2 3",
      },
    ],
    testCases: [
      { input: "4 5\n1 3 5 7\n0 2 6 8 9", output: "0 1 2 3\n5 6 7 8 9", isHidden: false },
      { input: "1 2\n1\n2 3", output: "1\n2 3", isHidden: false },
      { input: "3 3\n1 2 3\n4 5 6", output: "1 2 3\n4 5 6", isHidden: true },
      { input: "3 3\n4 5 6\n1 2 3", output: "1 2 3\n4 5 6", isHidden: true },
      { input: "2 2\n1 4\n2 3", output: "1 2\n3 4", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

void mergeTwoSortedArrays(vector<int>& arr1, vector<int>& arr2) {
    // Write your code here
}

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;
    vector<int> arr1(m), arr2(n);
    for (int i = 0; i < m; i++) cin >> arr1[i];
    for (int i = 0; i < n; i++) cin >> arr2[i];
    mergeTwoSortedArrays(arr1, arr2);
    for (int i = 0; i < m; i++) cout << arr1[i] << " \\n"[i == m - 1];
    for (int i = 0; i < n; i++) cout << arr2[i] << " \\n"[i == n - 1];
    return 0;
}`,
      python: `class Solution:
    def mergeTwoSortedArrays(self, arr1, arr2):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    m, n = int(input_data[0]), int(input_data[1])
    arr1 = list(map(int, input_data[2:m+2]))
    arr2 = list(map(int, input_data[m+2:m+n+2]))
    Solution().mergeTwoSortedArrays(arr1, arr2)
    print(*arr1)
    print(*arr2)`,
      javascript: `function mergeTwoSortedArrays(arr1, arr2) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const m = parseInt(input[0]), n = parseInt(input[1]);
const arr1 = input.slice(2, m + 2).map(Number);
const arr2 = input.slice(m + 2, m + n + 2).map(Number);
mergeTwoSortedArrays(arr1, arr2);
console.log(arr1.join(' '));
console.log(arr2.join(' '));`,
      java: `import java.util.*;

public class Main {
    public static void mergeTwoSortedArrays(int[] arr1, int[] arr2) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt(), n = sc.nextInt();
        int[] arr1 = new int[m], arr2 = new int[n];
        for (int i = 0; i < m; i++) arr1[i] = sc.nextInt();
        for (int i = 0; i < n; i++) arr2[i] = sc.nextInt();
        mergeTwoSortedArrays(arr1, arr2);
        StringBuilder s1 = new StringBuilder(), s2 = new StringBuilder();
        for (int i = 0; i < m; i++) s1.append(arr1[i]).append(i < m - 1 ? " " : "");
        for (int i = 0; i < n; i++) s2.append(arr2[i]).append(i < n - 1 ? " " : "");
        System.out.println(s1); System.out.println(s2);
    }
}`,
    },
    tags: ["Array", "Two Pointers", "Sorting"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 37. Find the Repeating and Missing Number
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Find the Repeating and Missing Number",
    slug: "repeating-and-missing-number",
    difficulty: "Hard",
    description:
      "Given an array of N integers containing values from 1 to N where one number appears twice (repeating) and one number is absent (missing), find both numbers. Return the repeating number first, then the missing number.",
    constraints: "2 <= N <= 10^5\n1 <= arr[i] <= N",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "Two space-separated integers — repeating number and missing number",
    sampleTestCases: [
      {
        input: "arr = [3, 1, 3]",
        output: "3 2",
        explanation: "3 is repeated and 2 is missing.",
      },
      {
        input: "arr = [4, 3, 6, 2, 1, 1]",
        output: "1 5",
        explanation: "1 repeats; 5 is missing.",
      },
    ],
    testCases: [
      { input: "3\n3 1 3", output: "3 2", isHidden: false },
      { input: "6\n4 3 6 2 1 1", output: "1 5", isHidden: false },
      { input: "2\n2 2", output: "2 1", isHidden: true },
      { input: "4\n1 2 2 4", output: "2 3", isHidden: true },
      { input: "5\n5 4 3 1 5", output: "5 2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

pair<int,int> findRepeatingAndMissing(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    auto [rep, mis] = findRepeatingAndMissing(arr);
    cout << rep << " " << mis << endl;
    return 0;
}`,
      python: `class Solution:
    def findRepeatingAndMissing(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    rep, mis = Solution().findRepeatingAndMissing(arr)
    print(rep, mis)`,
      javascript: `function findRepeatingAndMissing(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
const [rep, mis] = findRepeatingAndMissing(arr);
console.log(rep + ' ' + mis);`,
      java: `import java.util.*;

public class Main {
    public static int[] findRepeatingAndMissing(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int[] res = findRepeatingAndMissing(arr);
        System.out.println(res[0] + " " + res[1]);
    }
}`,
    },
    tags: ["Array", "Math", "Bit Manipulation"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 38. Count Inversions
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Count Inversions",
    slug: "count-inversions",
    difficulty: "Hard",
    description:
      "Given an array of N integers, count the number of inversions. A pair (i, j) is an inversion if i < j and arr[i] > arr[j]. Solve in O(N log N) using merge sort.",
    constraints: "1 <= N <= 10^5\n1 <= arr[i] <= 10^9",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the number of inversions",
    sampleTestCases: [
      {
        input: "arr = [2, 4, 1, 3, 5]",
        output: "3",
        explanation: "Inversions: (2,1), (4,1), (4,3).",
      },
      {
        input: "arr = [5, 4, 3, 2, 1]",
        output: "10",
        explanation: "Fully reversed: C(5,2) = 10 inversions.",
      },
    ],
    testCases: [
      { input: "5\n2 4 1 3 5", output: "3", isHidden: false },
      { input: "5\n5 4 3 2 1", output: "10", isHidden: false },
      { input: "1\n1", output: "0", isHidden: true },
      { input: "3\n1 2 3", output: "0", isHidden: true },
      { input: "4\n3 1 2 4", output: "2", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long countInversions(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << countInversions(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def countInversions(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().countInversions(arr))`,
      javascript: `function countInversions(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(countInversions(arr));`,
      java: `import java.util.*;

public class Main {
    public static long countInversions(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countInversions(arr));
    }
}`,
    },
    tags: ["Array", "Merge Sort", "Divide and Conquer"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 39. Reverse Pairs
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Reverse Pairs",
    slug: "reverse-pairs",
    difficulty: "Hard",
    description:
      "Given an array of N integers, count the number of reverse pairs. A pair (i, j) is a reverse pair if i < j and arr[i] > 2 * arr[j]. Solve in O(N log N).",
    constraints: "1 <= N <= 5 * 10^4\n-2^31 <= arr[i] <= 2^31 - 1",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the number of reverse pairs",
    sampleTestCases: [
      {
        input: "arr = [1, 3, 2, 3, 1]",
        output: "2",
        explanation: "Pairs: (3,1) at indices (1,4) and (3,1) at indices (3,4).",
      },
      {
        input: "arr = [2, 4, 3, 5, 1]",
        output: "3",
        explanation: "Pairs: (2,1), (4,1), (3,1).",
      },
    ],
    testCases: [
      { input: "5\n1 3 2 3 1", output: "2", isHidden: false },
      { input: "5\n2 4 3 5 1", output: "3", isHidden: false },
      { input: "1\n1", output: "0", isHidden: true },
      { input: "3\n1 2 3", output: "0", isHidden: true },
      { input: "4\n6 5 4 3", output: "3", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long reversePairs(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << reversePairs(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def reversePairs(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().reversePairs(arr))`,
      javascript: `function reversePairs(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(reversePairs(arr));`,
      java: `import java.util.*;

public class Main {
    public static long reversePairs(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(reversePairs(arr));
    }
}`,
    },
    tags: ["Array", "Merge Sort", "Divide and Conquer"],
  },

  // ─────────────────────────────────────────────────────────────────
  // 40. Maximum Product Subarray
  // ─────────────────────────────────────────────────────────────────
  {
    title: "Maximum Product Subarray",
    slug: "maximum-product-subarray",
    difficulty: "Medium",
    description:
      "Given an array of N integers, find the contiguous subarray within the array that has the largest product and return that product.",
    constraints: "1 <= N <= 2 * 10^4\n-10 <= arr[i] <= 10\narr[i] != 0 is NOT guaranteed",
    inputFormat: "First line: N\nSecond line: N space-separated integers",
    outputFormat: "A single integer — the maximum product of any contiguous subarray",
    sampleTestCases: [
      {
        input: "arr = [2, 3, -2, 4]",
        output: "6",
        explanation: "[2, 3] has the largest product 6.",
      },
      {
        input: "arr = [-2, 0, -1]",
        output: "0",
        explanation: "The result cannot be 2 because [-2, -1] is not a subarray. 0 is the max.",
      },
    ],
    testCases: [
      { input: "4\n2 3 -2 4", output: "6", isHidden: false },
      { input: "3\n-2 0 -1", output: "0", isHidden: false },
      { input: "1\n-3", output: "-3", isHidden: true },
      { input: "5\n-1 -2 -3 -4 -5", output: "120", isHidden: true },
      { input: "5\n1 -2 3 -4 5", output: "120", isHidden: true },
    ],
    boilerplates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long maxProductSubarray(vector<int>& arr) {
    // Write your code here
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << maxProductSubarray(arr) << endl;
    return 0;
}`,
      python: `class Solution:
    def maxProductSubarray(self, arr):
        pass

if __name__ == '__main__':
    import sys
    input_data = sys.stdin.read().split()
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    print(Solution().maxProductSubarray(arr))`,
      javascript: `function maxProductSubarray(arr) {
    // Write your code here
};

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = parseInt(input[0]);
const arr = input.slice(1, n + 1).map(Number);
console.log(maxProductSubarray(arr));`,
      java: `import java.util.*;

public class Main {
    public static long maxProductSubarray(int[] arr) {
        // Write your code here
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(maxProductSubarray(arr));
    }
}`,
    },
    tags: ["Array", "Dynamic Programming"],
  },
];

// module.exports = problems;


const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");
        
        await Problem.deleteMany({});
        await Problem.insertMany(problems);
        
        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
